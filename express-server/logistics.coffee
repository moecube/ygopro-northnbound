Data = require 'ygojs-data'
pool = require './pool'

module.exports.maxLength = 55

module.exports.next = (player, choice) ->
  switch player.status
    when -1
      player.status = 0
      player.position = 0
    when 0
      pool = player.pool[player.position]
      player.deck.transformToId()
      if pool.length % 2 == 1
        id = pool[choice]
        card = Data.Environment['zh-CN'][id]
        if card and card.isEx
          player.deck.ex.push id
        else
          player.deck.main.push id
        player.position += 1
      else
        length = pool.length / 2
        ids = if choice >= length then pool[length..-1] else pool[0..length - 1]
        card = Data.Environment['zh-CN'][ids[0]]
        if card and card.isEx
          player.deck.ex = player.deck.ex.concat ids
        else
          player.deck.main = player.deck.main.concat ids
        player.position += length
      player.status = 10 if player.position >= module.exports.maxLength
    when 1
      player.deck.main.splice(choice, 1)
      player.position += 1
      player.status = 10 if player.position >= 4 # 记得改
    when 10
      # ok
      return