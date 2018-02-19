pool = require './pool'
pg = require './pg'


test = ->
  p = pool.generate_player('123')
  await pg.save_player p
  p = await pg.load_player '123'
  console.log p

test()