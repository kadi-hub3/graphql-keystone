const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const PROJECT_NAME = ' GraphQL';
const dotenv = require('dotenv').config()
const adapterConfig = { mongoUri: process.env.MONGO_URI };
const bookSchema = require('./List/Book')
const userSchema = require('./List/User')


const isAdmin = ({ authentication: { item: user } }) => {
  return !!user && !!user.isAdmin
}
const isLoggedin = ({ authentication: { item: user } }) => {
  return !!user
}



const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET
});

keystone.createList('Book', {
  fields: bookSchema.fields,
  access: {
    read: true,
    create: isLoggedin,
    update: isLoggedin,
    delete: isLoggedin
  }
})
keystone.createList('User', {
  fields: userSchema.fields,
  access: {
    read: true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  }
})
keystone.createList('User', userSchema)

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password'
  }
})

module.exports = {
  keystone,
  apps: [new GraphQLApp(),
  new AdminUIApp({
    name: PROJECT_NAME, enableDefaultRoute: true, authStrategy,
    isAccessAllowed: isAdmin
  })],
};
