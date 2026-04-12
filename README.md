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
