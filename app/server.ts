import App from "./app";


const main = async () => {
  const { app, server } = await App();
  app.listen({ port: 3333 }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`))

};

main().catch((error) => {
  console.log(error, 'error');
})