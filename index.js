const Command = require('command');

/*
  ROLE IDS
  0: Tank
  1: DPS
  2: Healer

  BATTLEGROUND IDS
  5: Kumasylum
  10: Corsair's Stronghold
  11: *not enough players to enter as solo* (probably corsairs premade)
  26: Fraywind Canyon
  27: Fraywind Canyon (equalized)
  37: *not enough players to enter as solo*
  38: Champion's skyring (solo)
  39: *not enough players to enter as solo*
  40: Champion's skyring mark V -- Equalized (solo)
  46: Wintera snowfield
  47: Wintera snowfield (again?)
  70: Gridiron
 */

module.exports = function Queue(dispatch) {
	const command = Command(dispatch);

  let playerId = null;
  let role = 1;

  dispatch.hook('S_LOGIN', 10, event => {
      playerId = event.playerId;
  })

  dispatch.hook('C_ADD_INTER_PARTY_MATCH_POOL', 1, event => {
    command.message('Queuing for ' + event.instances.map(i => i.id));
  });

  command.add('qrole', (arg) => {
    role = parseInt(arg);
    command.message('Set role to ' + role);
  });

  command.add('qbg', (arg) => {
    let instances = [];
    if (arg && !isNaN(arg)) {
      instances.push({ id: parseInt(arg) });
    } else {
      instances.push({ id: 10 });
      instances.push({ id: 26 });
    }
    dispatch.toServer('C_ADD_INTER_PARTY_MATCH_POOL', 1, {
      unk: 0,
      preferredLeader: 0,
      type: 1,
      instances,
      players: [
        {
          id: playerId,
          role
        }
      ]
    });
  });

  command.add('qdg', (arg) => {
    let instances = [];
    if (arg && !isNaN(arg)) {
      instances.push({ id: parseInt(arg) });
    } else {
      instances.push({ id: 10 });
      instances.push({ id: 26 });
    }
    dispatch.toServer('C_ADD_INTER_PARTY_MATCH_POOL', 1, {
      unk: 0,
      preferredLeader: 0,
      type: 0,
      instances,
      players: [
        {
          id: playerId,
          role
        }
      ]
    });
  });
}
