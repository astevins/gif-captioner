import {belongsTo, createServer, Model, Response} from "miragejs"

export function initMockServer(environment = "test") {
    return createServer({
        environment,

        models: {
            originalGif: Model,
            captionedGif: Model.extend({
                originalGif: belongsTo()
            })
        },

        routes() {
            this.namespace = "api";

            // Responding to POST request to upload gif
            this.post("/original-gifs", (schema, request) => {
                console.log("Post called");

                return new Response(200,
                    {
                        body:
                            {
                                data: {
                                    name: "toad.gif",
                                    id: 1
                                }
                            }
                    });
            })

            // Responding to GET request to retrieve original gif
            this.get("/original-gifs/:id", (schema, request) => {
                return schema.originalGifs.find(request.params.id);
            })
        }
    });
}

initMockServer();