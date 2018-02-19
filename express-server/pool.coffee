card_pools = [

]

path = require 'path'
ygopro = require 'ygojs-data'
Database = require 'better-sqlite3'
pg = require './pg'
logistics = require './logistics'

range_reg = new RegExp "(\\d+)\\s*(\\-\\s*(\\d+))?"

load_pool = ->
  pool_file = require './pool.json'
  card_pools.length = 0
  for card_pool in pool_file
    range_str = card_pool.range
    match = range_str.match range_reg
    if match
      range =
        min: match[1]
        max: if match[3] then match[3] else match[1]
    else
      console.log "Illegal range message #{range_str} for #{card_pool.name}"
    cards = null
    if Array.isArray card_pool.cards
      cards = card_pool.cards
    else if card_pool.cards.type == 'database'
      try
        db = new Database path.join __dirname, card_pool.cards.source
        cards = db.prepare(card_pool.cards.command).all().map (row) => row.id
      catch ex
        console.log "failed to load cards message from database in #{card_pool.name}, because #{ex}"
        cards = []
    else if card_pool.cards.type == 'deck'
      sources = if Array.isArray card_pool.cards.source then card_pool.cards.source else [card_pool.cards.source]
      for source in sources
        try
          deck = ygopro.Deck.fromFileSync path.join __dirname, source
          cards = deck.main.concat(deck.side).concat(deck.ex)
        catch ex
          console.log "failed to load cards message from deck in #{card_pool.name}, because #{ex}"
          cards = []
    else
      console.log "Unknown pool message #{cards} for #{card_pool.name}"
    console.log "Warning: No card loaded for pool #{card_pool.name}." if !cards or cards.length == 0
    card_pools.push
      name: card_pool.name
      range: range
      cards: cards
    logistics.maxLength = range.max if range.max > logistics.maxLength

  card_pools

generate_user_pool = (length, num) ->
  index = 1
  pool = []
  while index < length
    index_before_iterator = index
    for card_pool in card_pools
      if index >= card_pool.range.min and index <= card_pool.range.max
        while index <= card_pool.range.max
          pool[index - 1] = random_select_from_pool card_pool.cards, num
          index += 1
    if index == index_before_iterator
      console.log("No card pool defined for index #{index}")
      pool[index - 1] = []
      index += 1
  pool

random_select_from_pool = (arr, num) ->
  result = [];
  count = arr.length;
  arr = arr.slice 0
  for i in [0..num - 1]
    index = ~~(Math.random() * count) + i
    result[i] = arr[index]
    arr[index] = arr[i]
    count--
  result

module.exports.generate_player = (player_name) ->
  console.log "Generate Data for #{player_name}"
  player =
    name: player_name
    status: 0
    position: 0
    deck: new ygopro.Deck
    pool: generate_user_pool 40, 3
  pg.set_player player_name, player
  player

load_pool()