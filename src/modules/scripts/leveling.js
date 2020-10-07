//const { Converters, Extractors } = require('discord-noob');
const { Converters, Extractors } = require('../../index');

exports.run = async (options, eventEmitter) => {
    let guildMember = Extractors.guild(eventEmitter);
    let guild = Extractors.member(eventEmitter);
    eventEmitter.guild = guild;

    let data = eventEmitter.client.data.get('leveling');
    data[guild.id] = data[guild.id] || {};
    let userData = data[guild.id][guildMember.id] || {};

    let counter = userData.counter || 0;
    let currentRole = Converters.role(userData.currentRole, eventEmitter);
    let expectedRole = await getExpectedRole(options, eventEmitter, counter + 1);
    if (currentRole && (!expectedRole || currentRole.id !== expectedRole.id) )
        guildMember.roles.remove(currentRole).catch(console.error);

    if (expectedRole && (!currentRole || currentRole.id !== expectedRole.id))
        guildMember.roles.add(expectedRole).catch(console.error);

    userData = {counter: counter+1, currentRole: expectedRole? expectedRole.id : null}

    data[guildMember.guild.id][guildMember.id] = userData;
    eventEmitter.client.data.set('leveling', data);
}

async function getExpectedRole(options, eventEmitter, counter) {
    let role;
    for (let optRole of options.roles.sort((a,b) => a[0] - b[0])) {
        if (intDiv(counter, options.amountLevel) >= optRole[0])
            role = optRole;
        else break;
    }
    if (!role) return;
    let output = Converters.role(role[1], eventEmitter) || await createRole(role, eventEmitter);
    if (!output && role) {
        console.error(`No role ${role} could be found and it couldn't be created.`);
    }
    return output;
}

function intDiv(a, b) {
    return (a - (a % b)) / b;
}

async function createRole(role, eventEmitter) {
    try {
        return await eventEmitter.guild.roles.create({
            data: {
                name: role[1],
                color: role[2]
            }
        });
    } catch (e) {
        console.error(`Couldn't create the role ${role[1]}.`);
        return null;
    }
}