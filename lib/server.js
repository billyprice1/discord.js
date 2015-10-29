"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerPermissions = require("./ServerPermissions.js");
var Member = require("./Member.js");

var Server = (function () {
	function Server(data, client) {
		_classCallCheck(this, Server);

		this.client = client;
		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = [];
		this.channels = [];
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelId = data.afk_channel_id;

		this.roles = [];

		for (var _iterator = data.roles, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var permissionGroup = _ref;

			this.roles.push(new ServerPermissions(permissionGroup, this));
		}

		if (!data.members) {
			data.members = [client.user];
			return;
		}

		for (var _iterator2 = data.members, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var member = _ref2;

			// first we cache the user in our Discord Client,
			// then we add it to our list. This way when we
			// get a user from this server's member list,
			// it will be identical (unless an async change occurred)
			// to the client's cache.
			if (member.user) this.addMember(client.addUser(member.user), member.roles);
		}
	}

	// get/set

	Server.prototype.getRole = function getRole(key, value) {
		for (var _iterator3 = this.roles, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
			var _ref3;

			if (_isArray3) {
				if (_i3 >= _iterator3.length) break;
				_ref3 = _iterator3[_i3++];
			} else {
				_i3 = _iterator3.next();
				if (_i3.done) break;
				_ref3 = _i3.value;
			}

			var role = _ref3;

			if (role[key] === value) {
				return role;
			}
		}

		return null;
	};

	Server.prototype.addRole = function addRole(data) {

		if (this.getRole("id", data.id)) {
			return this.getRole("id", data.id);
		}

		var perms = new ServerPermissions(data, this);
		this.roles.push(perms);
		return perms;
	};

	Server.prototype.updateRole = function updateRole(data) {

		var oldRole = this.getRole("id", data.id);

		if (oldRole) {
			var index = this.roles.indexOf(oldRole);
			this.roles[index] = new ServerPermissions(data, this);

			return this.roles[index];
		} else {
			return false;
		}
	};

	Server.prototype.removeRole = function removeRole(id) {
		for (var roleId in this.roles) {
			if (this.roles[roleId].id === id) {
				this.roles.splice(roleId, 1);
			}
		}

		for (var _iterator4 = this.members, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
			var _ref4;

			if (_isArray4) {
				if (_i4 >= _iterator4.length) break;
				_ref4 = _iterator4[_i4++];
			} else {
				_i4 = _iterator4.next();
				if (_i4.done) break;
				_ref4 = _i4.value;
			}

			var member = _ref4;

			for (var roleId in member.rawRoles) {
				if (member.rawRoles[roleId] === id) {
					member.rawRoles.splice(roleId, 1);
				}
			}
		}
	};

	Server.prototype.getChannel = function getChannel(key, value) {
		for (var _iterator5 = this.channels, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
			var _ref5;

			if (_isArray5) {
				if (_i5 >= _iterator5.length) break;
				_ref5 = _iterator5[_i5++];
			} else {
				_i5 = _iterator5.next();
				if (_i5.done) break;
				_ref5 = _i5.value;
			}

			var channel = _ref5;

			if (channel[key] === value) {
				return channel;
			}
		}

		return null;
	};

	Server.prototype.getMember = function getMember(key, value) {
		for (var _iterator6 = this.members, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
			var _ref6;

			if (_isArray6) {
				if (_i6 >= _iterator6.length) break;
				_ref6 = _iterator6[_i6++];
			} else {
				_i6 = _iterator6.next();
				if (_i6.done) break;
				_ref6 = _i6.value;
			}

			var member = _ref6;

			if (member[key] === value) {
				return member;
			}
		}

		return null;
	};

	Server.prototype.removeMember = function removeMember(key, value) {
		for (var _iterator7 = this.members, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
			var _ref7;

			if (_isArray7) {
				if (_i7 >= _iterator7.length) break;
				_ref7 = _iterator7[_i7++];
			} else {
				_i7 = _iterator7.next();
				if (_i7.done) break;
				_ref7 = _i7.value;
			}

			var member = _ref7;

			if (member[key] === value) {
				this.members.splice(key, 1);
				return member;
			}
		}

		return false;
	};

	Server.prototype.addChannel = function addChannel(chann) {
		if (!this.getChannel("id", chann.id)) {
			this.channels.push(chann);
		}
		return chann;
	};

	Server.prototype.addMember = function addMember(user, roles) {
		if (!this.getMember("id", user.id)) {
			var mem = new Member(user, this, roles);
			this.members.push(mem);
		}
		return mem;
	};

	Server.prototype.toString = function toString() {
		return this.name;
	};

	Server.prototype.equals = function equals(object) {
		return object.id === this.id;
	};

	_createClass(Server, [{
		key: "permissionGroups",
		get: function get() {
			return this.roles;
		}
	}, {
		key: "permissions",
		get: function get() {
			return this.roles;
		}
	}, {
		key: "iconURL",
		get: function get() {
			if (!this.icon) return null;
			return "https://discordapp.com/api/guilds/" + this.id + "/icons/" + this.icon + ".jpg";
		}
	}, {
		key: "afkChannel",
		get: function get() {
			if (!this.afkChannelId) return false;

			return this.getChannel("id", this.afkChannelId);
		}
	}, {
		key: "defaultChannel",
		get: function get() {
			return this.getChannel("name", "general");
		}
	}, {
		key: "owner",
		get: function get() {
			return this.client.getUser("id", this.ownerID);
		}
	}, {
		key: "users",
		get: function get() {
			return this.members;
		}
	}]);

	return Server;
})();

module.exports = Server;