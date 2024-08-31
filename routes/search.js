const express = require('express');
const router = express.Router();
const { User, PolicyInfo } = require('../models/commonModel'); 

router.get('/search/:username', async (req, res) => {
  try {
    const user = await User.findOne({ firstName: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const policies = await PolicyInfo.find({ user: user._id }).populate('policyCategory policyCarrier');
    res.json(policies);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;
