const express = require('express');
const router = express.Router();
const { User, PolicyInfo, PolicyCategory, PolicyCarrier } = require('../models/commonModel'); 

router.get('/aggregatedPolicies', async (req, res) => {
  try {
    const users = await User.find();
    const results = [];

    for (const user of users) {
      const policies = await PolicyInfo.find({ user: user._id }).populate('policyCategory').populate('policyCarrier');

      if (policies.length > 0) {
        policies.map(async (policiesData) => {
          policiesData.policyCategory =  await PolicyCategory.findOne({_id: policiesData.policyCategory});
          policiesData.policyCarrier =  await PolicyCarrier.findOne({_id: policiesData.policyCarrier});
          return policiesData
        })
      }
      results.push({
        user,
        policies,
        policyCount: policies.length
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;
