express = require 'express'
bodyParser = require 'body-parser'
data = require 'ygojs-data'
path = require 'path'
pg = require './pg'
pool = require './pool'
logistic = require './logistics'

data.Environment.setConfig
  databasePath: path.join __dirname, "ygopro-database/locales/"

server = express()

server.use express.static('angular-frontend/dist')
server.use (req, res, next) ->
  res.header "Access-Control-Allow-Origin", "*"
  next()

server.all '/card/:locale/:id', bodyParser.text({type: "*/*"}), data.Server.expressResponse

server.get '/pick/:player_name/status', (req, res) ->
  player_name = req.params.player_name || 'anonymous'
  if player_name == "null"
    res.json null
    return
  player = await pg.load_player(player_name)
  player = pool.generate_player player_name unless player
  res.json preprocess player

server.post '/pick/:player_name/next', bodyParser.text({type: "*/*"}), (req, res) ->
  player_name = req.params.player_name || 'anonymous'
  player = await pg.load_player(player_name)
  if player and player.status > 10
    res.json preprocess player
    return
  player = pool.generate_player player_name unless player
  logistic.next player, JSON.parse req.body
  await pg.ready_player player_name if player.status > 10
  res.json preprocess player

server.get '/pick/:player_name/sort', (req, res) ->
  player_name = req.params.player_name || 'anonymous'
  player = await pg.load_player(player_name)
  player = pool.generate_player player_name unless player
  player.deck.sort new data.Environment 'zh-CN'
  player.deck.transformToId()
  res.json preprocess player

server.delete '/:player_name', (req, res) ->
  player_name = req.params.player_name || 'anonymous'
  if player_name == 'anonymous'
    res.end 'not exist'
    return
  await pg.remove_player player_name
  res.end 'ok'

preprocess = (player) ->
  player = JSON.parse JSON.stringify player
  if player.status == 0
    player.choices = player.pool[player.position]
  if player.status >= 0
    player.pool = undefined
  player

server.get '*', (req, res) ->
  res.sendFile path.resolve('angular-frontend/dist', 'index.html')

server.listen 8080
