sfdx force:config:set defaultdevhubusername=lunuro@dev.com
sfdx force:org:create -s -f config/project-scratch-def.json -v lunuro@dev.com
sfdx force:source:push -f
sfdx force:org:open