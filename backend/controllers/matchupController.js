const asyncHandler = require('express-async-handler');
const Matchup = require("../models/matchupModel");
const User = require("../models/userModel");

/**
 * Retrieve matchups for a given user and champion
 * @param req request object which should contain champion information and the deencoded user token
 * @param res response object
 */
const getMatchups = asyncHandler(async (req, res) => {
    //in the authMiddleware, we are checking the token and assigning the current req.user (alias for req.session.user) to the object that is returned using the deencoded token
    if (!req.query.champion1 || !req.query.champion2){
        res.status(200);
        res.json({});
        //throw new Error("Need 2 champions");
    }
    const matchups = await Matchup.find({user: req.user.id, champion1: req.query.champion1, champion2: req.query.champion2});
    res.status(200)
    res.json(matchups);
})

/**
 * Create a matchup given the required information
 * @param req request object which should contain champion information, the deencoded token, and information about the matchup
 * @param res response object
 */
const createMatchup = asyncHandler(async (req, res) => {
    //async handler is related to errorsthrown by async functions
    if ( !req.body.champion2 || !req.body.champion1 || !req.body.text){
        res.status(400);
        throw new Error("Fill out all fields");
    }

    const matchup = await Matchup.create({
        text : req.body.text,
        champion1: req.body.champion1,
        champion2: req.body.champion2,
        user: req.user.id
    })
    res.status(200)
    res.json(matchup);
})

/**
 * Update a matchup given the required information
 * @param req request object which should contain champion information, the deencoded token, and information about the matchup
 * @param res response object
 */
const updateMatchup = asyncHandler(async (req, res) => {
    const matchup = await Matchup.findById(req.params.id);
    if(!matchup){
        res.status(400);
        throw new Error("Matchup not Found");
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(matchup.user.toString() !== req.user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    const updatedMatchup = await Matchup.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
    })
    res.status(200)
    res.json(updatedMatchup);
})

/**
 * Update a matchup given the id of a matchup
 * @param req request object which should the id of the matchup
 * @param res response object
 */
const deleteMatchup = asyncHandler(async (req, res) => {
    const matchup = await Matchup.findById(req.params.id);
    if(!matchup){
        res.status(400);
        throw new Error("Matchup not Found");
    }

    //user.id is extracted from token in auth middleware

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(matchup.user.toString() !== req.user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    await matchup.remove();
    res.status(200)
    res.json({id: req.params.id});
})

module.exports= {
    getMatchups,
    createMatchup,
    updateMatchup,
    deleteMatchup
}