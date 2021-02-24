const express = require('express')
const expressGraphQl = require('express.graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql')
const app = express()



const authors = [
    { id: 1, name: 'Branner Wens'},
    { id: 1, name: 'Lions Bear'},
    { id: 1, name: 'Branny CoresMan'},
]
const movies = [
    { id: 1,  title= 'Everything Everything', authorId: 1},
    { id: 2,  title= 'Everytime Everything', authorId: 2},
    { id: 3,  title= 'My eyes always', authorId: 3},
    { id: 4,  title= 'Everything Everything', authorId: 3},
    { id: 5,  title= 'Everything Everything', authorId: 3},
    { id: 6,  title= 'Everything Everything', authorId: 3},
    { id: 7,  title= 'Everything Everything', authorId: 1},
    { id: 8,  title= 'Everything Everything', authorId: 2},
    { id: 9,  title= 'Everything Everything', authorId: 2},
]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    description: 'This is a Movie Written by an Author',
    fields: () => ({
        id: {type:  GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        title: { type: GraphQLNonNull(GraphQLString)},
        authorId: {type:  GraphQLNonNull(GraphQLInt)},
        writers: {type: AuthorType,
            resolve: (movie) => {
                return authors.find(author => author.Id === movie.authorId)
            }
        }

    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of the book',
    fields: () => ({
        id: {type:  GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        title: { type: GraphQLNonNull(GraphQLString)},
        movies: { 
            type: new GraphQLList(MovieType),

        resolve: (author) =>{
            return movies.filter(movie => movie.authorId === author.id )
        }
        }
    })
})
const RootQueryType  = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () =>({
        movie: {
            type: MovieType,
            description: 'Love Bird Movies',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        movies:{
          type: new GraphQLList(MovieType),
            description: 'List of All Movies',
            resolve: () => movies
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Movies',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A Single Author Type',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
       addMovie: {
           type: MovieType,
           description: 'New Movie',
           args: {
               name: { type: GraphQLNonNull(GraphQLString)},
               title: { type: GraphQLNonNull(GraphQLString)},
               authorId: { type: GraphQLNonNull(GraphQLInt)}
           },
           resolve: (parent, args) => {
               const movie = { id: movie.length + 1, name: args.name, authorId: args.authorId }

               books.push(movie)
               return movie
           },
           addAuthor: {
            type: AuthorType,
            description: 'Add An Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = { id: authors.length + 1, name: args.name }
                authors.push(author)
                return movie
            }
        }

       }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('Server Running'))