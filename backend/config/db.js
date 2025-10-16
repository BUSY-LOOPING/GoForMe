import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    // define: {
    // hooks: true
    // }
  }
);

const umzug = new Umzug({
  migrations: {
    glob: join(__dirname, "../migrations/*.js"),
    resolve: ({ name, path }) => {
      return {
        name,
        up: async () => {
          const migration = await import(pathToFileURL(path).href);
          return migration.up(sequelize.getQueryInterface(), Sequelize);
        },
        down: async () => {
          const migration = await import(pathToFileURL(path).href);
          return migration.down(sequelize.getQueryInterface(), Sequelize);
        },
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const runMigrations = async () => {
  try {
    console.log("Running database migrations...");
    const migrations = await umzug.up();

    if (migrations.length === 0) {
      console.log("No pending migrations");
    } else {
      console.log(
        "Migrations completed:",
        migrations.map((m) => m.name).join(", ")
      );
    }

    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

const runSeeders = async () => {
  try {
    console.log("Running database seeders...");
    const seederUmzug = new Umzug({
      migrations: {
        glob: join(__dirname, "../seeders/*.js"),
        resolve: ({ name, path }) => {
          return {
            name,
            up: async () => {
              const seeder = await import(pathToFileURL(path).href);
              return seeder.up(sequelize.getQueryInterface(), Sequelize);
            },
            down: async () => {
              const seeder = await import(pathToFileURL(path).href);
              return seeder.down(sequelize.getQueryInterface(), Sequelize);
            },
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize,
        tableName: "SequelizeSeeds",
      }),
      logger: console,
    });

    const seeders = await seederUmzug.up();

    if (seeders.length === 0) {
      console.log("No pending seeders");
    } else {
      console.log("Seeders completed:", seeders.map((s) => s.name).join(", "));
    }

    return true;
  } catch (error) {
    console.error("Seeder failed:", error);
    return false;
  }
};

export { sequelize, runMigrations, runSeeders };
