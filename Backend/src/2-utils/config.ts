class Config {
    public port = 3001;
    public mysqlHost = "localhost";
    public mysqlUser = "root";
    public mysqlPassword = "";
    public mysqlDatabase = "vacations";
    public imagesFolderPath = "./src/1-assets/images/"
}

const config = new Config();

export default config;
