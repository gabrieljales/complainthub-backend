// Arquivo responsável por iniciar e executar o servidor Express

import { app } from "./app";

const port = process.env.APP_PORT;
app.listen(port, () => console.log(`Server is running on port ${port}!`));