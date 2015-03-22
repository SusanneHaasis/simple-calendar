const Hapi = require('hapi');
const Good = require('good');
const Path = require('path');

const server = new Hapi.Server();
server.connection({port: 8080});

server.views({
    engines: {
        hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    partialsPath: './views/partials'
});
server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        var greeting = request.query.greeting !== undefined ? request.query.greeting : 'Hello';
        reply.view('index', {greeting: greeting});
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            args: [{log: '*', response: '*'}]
        }]
    }
}, (err) => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(() => server.log('info', 'Server running at: ' + server.info.uri));
});
