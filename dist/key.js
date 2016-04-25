"use strict";

var KeyMirror = function KeyMirror(obj) {
    var ret = {};

    Object.keys(obj).forEach(function (key) {
        ret[key] = key;
    });

    return ret;
};

module.exports = KeyMirror({
    profile: null,
    current_path: null,
    workspace_list: null,
    username: null,
    password: null,
    domains: null,
    domainsSize: null,
    ip: null,
    mac: null,
    random: null,
    normal: null
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9rZXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksU0FBWixTQUFZLE1BQU87QUFDbkIsUUFBSSxNQUFNLEVBQVY7O0FBRUEsV0FBTyxJQUFQLENBQWEsR0FBYixFQUFtQixPQUFuQixDQUE0QixlQUFPO0FBQy9CLFlBQUssR0FBTCxJQUFhLEdBQWI7QUFDSCxLQUZEOztBQUlBLFdBQU8sR0FBUDtBQUNILENBUkQ7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLFVBQVc7QUFDeEIsYUFBaUIsSUFETztBQUV4QixrQkFBaUIsSUFGTztBQUd4QixvQkFBaUIsSUFITztBQUl4QixjQUFpQixJQUpPO0FBS3hCLGNBQWlCLElBTE87QUFNeEIsYUFBaUIsSUFOTztBQU94QixpQkFBaUIsSUFQTztBQVF4QixRQUFpQixJQVJPO0FBU3hCLFNBQWlCLElBVE87QUFVeEIsWUFBaUIsSUFWTztBQVd4QixZQUFpQjtBQVhPLENBQVgsQ0FBakIiLCJmaWxlIjoia2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEtleU1pcnJvciA9IG9iaiA9PiB7XG4gICAgdmFyIHJldCA9IHt9XG5cbiAgICBPYmplY3Qua2V5cyggb2JqICkuZm9yRWFjaCgga2V5ID0+IHtcbiAgICAgICAgcmV0WyBrZXkgXSA9IGtleVxuICAgIH0gKVxuXG4gICAgcmV0dXJuIHJldFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEtleU1pcnJvcigge1xuICAgIHByb2ZpbGUgICAgICAgIDogbnVsbCxcbiAgICBjdXJyZW50X3BhdGggICA6IG51bGwsXG4gICAgd29ya3NwYWNlX2xpc3QgOiBudWxsLFxuICAgIHVzZXJuYW1lICAgICAgIDogbnVsbCxcbiAgICBwYXNzd29yZCAgICAgICA6IG51bGwsXG4gICAgZG9tYWlucyAgICAgICAgOiBudWxsLFxuICAgIGRvbWFpbnNTaXplICAgIDogbnVsbCxcbiAgICBpcCAgICAgICAgICAgICA6IG51bGwsXG4gICAgbWFjICAgICAgICAgICAgOiBudWxsLFxuICAgIHJhbmRvbSAgICAgICAgIDogbnVsbCxcbiAgICBub3JtYWwgICAgICAgICA6IG51bGxcbn0gKVxuIl19