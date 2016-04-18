let DIR_CONFIG = '/nest/server/config',
    FILE_ETC   = `${DIR_CONFIG}/etc.json`,
    FILE_SITE  = `${DIR_CONFIG}/site.json`,
    FILE_VHOST = `${DIR_CONFIG}/virtual_host.json`

module.exports = {
    APPS         : '/apps',
    NEST         : '/nest',
    FILE_ETC,
    FILE_SITE,
    FILE_VHOST,
    FILE_SERVICE : '/nest/jserver/config/service.json',
    SITE_SUFFIX  : '.fedevot.meilishuo.com',
    URL_SERVER   : 'http://172.18.16.20:2016/'
}
