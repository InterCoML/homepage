# InterCoML homepage

To build and run the homepage locally, clone this repository, make sure to install **docker** and **docker-compose**,
enter the main folder of this repository and run the following command:

```shell
docker compose run intercoml-homepage ./updateWebsite.sh watch
```

The webpage should now be available under http://localhost:4000/ in your browser.
Changes to the source files will be automatically detected and the page will reload in the browser.

To compile the website for production, run:

```shell
docker compose run intercoml-homepage ./updateWebsite.sh compile
```

The compiled website will be available in the `html/` directory.

## Importing working group members from a CSV export

Place the CSV export from the COST website (e.g., `CA24136-WG-members.csv`) in the
project root and run:

```shell
./import-wg-members.sh
```

Or specify a different path:

```shell
./import-wg-members.sh path/to/members.csv
```

The script processes only rows with `Application Status = "approved"`. For each
approved member:

- If a member YAML file with a matching slug exists, only the `wgs` field is
  updated (preserving all other fields).
- Otherwise, a new YAML file is created with `name`, `mail`, `address` and `wgs`.

The script warns about name collisions (different people with the same last
name); these need to be resolved manually by renaming the affected YAML files.

CSV files are excluded from the repository via `.gitignore`.
