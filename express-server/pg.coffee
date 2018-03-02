Pool = require('pg').Pool
Data = require('ygojs-data')
Config = require("./config.json")

sql_pool = new Pool Config.database

###
  STATUS 状态机
  -1: 未开始游戏
  0: 正在选卡，已经选卡 position 张
  1: 正在删卡，已经删卡 position 张
  10: 可以进行游戏，卡组为 deck
###


GENERATE_TABLE_COMMAND = """
CREATE TABLE IF NOT EXISTS player_status
  (
      name VARCHAR PRIMARY KEY,
      status INT DEFAULT 0,
      position INT DEFAULT 0,
      deck VARCHAR
  );
CREATE TABLE IF NOT EXISTS player_cards
  (
      name VARCHAR,
      position SERIAL,
      card1 INT,
      card2 INT,
      card3 INT,
      card4 INT,
      card5 INT,
      card6 INT,
      card7 INT,
      card8 INT,
      card9 INT,
      card10 INT,
      CONSTRAINT player_cards_name_position_pk PRIMARY KEY (name, position)
  );
"""

LOAD_CARD_POOL_COMMAND = "SELECT * FROM player_cards WHERE name = $1::text ORDER BY position"
SAVE_CARD_POOL_COMMAND = "INSERT INTO player_cards VALUES"
LOAD_PLAYER_STATUS = "SELECT * FROM player_Status WHERE name = $1::text"
SAVE_PLAYER_STATUS = """
  INSERT INTO player_status VALUES ($1::text, $2, $3, $4::text)
  ON CONFLICT (name) DO UPDATE SET
    status = EXCLUDED.status,
    position = EXCLUDED.position,
    deck = EXCLUDED.deck
"""

REMOVE_PLAYER_COMMAND = "DELETE FROM player_cards WHERE name = $1::text"
REMOVE_CARD_POOL_COMMAND = "DELETE FROM player_status WHERE name = $1::text"

generate_table = ->
  await sql_pool.query GENERATE_TABLE_COMMAND

module.exports.load_player = (player_name) ->
  player = player_cache.get player_name
  return player if player
  result = await sql_pool.query LOAD_PLAYER_STATUS, [player_name]
  player = result.rows[0]
  if player
    # Load Card Pool
    result = await sql_pool.query LOAD_CARD_POOL_COMMAND, [player_name]
    if result
      pool = []
      result.rows.forEach (data) -> pool[data.position] = data
      pool = pool.map (item) ->
        cards = []
        [1..10].map (num) -> cards[num - 1] = item['card' + num] if item['card' + num]
        cards
      player.pool = pool
    # Parse Deck
    player.deck = Data.Deck.fromString(player.deck)
    player_cache.set player_name, player if player
  player

module.exports.save_player = (player) ->
  deck = player.deck.toString()
  await sql_pool.query SAVE_PLAYER_STATUS, [player.name, player.status, player.position, deck]
  values = []
  if player.pool
    for index, cards of player.pool
      parameters = ["'" + player.name + "'", index].concat(cards)
      parameters.push 0 while parameters.length < 12
      values.push "(" + parameters.join(", ") + ")"
  statement = SAVE_CARD_POOL_COMMAND + values.join ","
  statement += " ON CONFLICT DO NOTHING"
  await sql_pool.query statement

module.exports.ready_player = (player_name) ->
  await sql_pool.query REMOVE_CARD_POOL_COMMAND, [player_name]

module.exports.remove_player = (player_name) ->
  player_cache.delete player_name
  await sql_pool.query REMOVE_PLAYER_COMMAND, [player_name]
  await sql_pool.query REMOVE_CARD_POOL_COMMAND, [player_name]

module.exports.set_player = (player_name, player) ->
  player_cache.set player_name, player

player_cache = new Map

heartBeat = ->
  promises = []
  player_cache.forEach (player, player_name) =>
     promises.push module.exports.save_player player
  Promise.all(promises).then ->
    player_cache.clear()

generate_table()
setInterval heartBeat, 60 * 10 * 1000