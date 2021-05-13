import {belongsTo, createServer, Model, Response} from "miragejs"
import {ORIGINAL_GIF} from "../../api-paths";

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

            // Responding to PUT request to upload gif
            this.put(ORIGINAL_GIF, (schema, request) => {
                console.log("Put /original-gif called");

                return new Response(200, {},
                    {name: "toad.gif"});
            })

            // Responding to GET request to retrieve original gif
            this.get("/files/original-gif", (schema, request) => {
                return new Response(200,
                    {
                        body:
                            {
                                data: {
                                    name: "toad.gif",
                                }
                            }
                    });
            })
        }
    });
}

initMockServer();

it("dummy test", () => {});