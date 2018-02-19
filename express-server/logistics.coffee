Data = require 'ygojs-data'
pool = require './pool'

module.exports.maxLength = 55

module.exports.next = (player, choice) ->
  switch player.status
    when -1
      player.status = 0
      player.position = 0
    when 0
      id = player.pool[player.position][choice]
      card = Data.Environment['zh-CN'][id]
      if card and card.isEx
        player.deck.ex.push id
      else
        player.deck.main.push id
      player.deck.transformToId();
      player.position += 1
      player.status = 10 if player.position >= module.exports.maxLength
    when 1
      player.deck.main.splice(choice, 1)
      player.position += 1
      player.status = 10 if player.position >= 4 # 记得改
    when 10
      # ok
      return