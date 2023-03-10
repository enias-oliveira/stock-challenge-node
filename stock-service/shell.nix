{ pkgs ? import <nixpkgs> { } }:

with pkgs;

mkShell {
  buildInputs = [ nodejs postgresql ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"

    export LANG="en_US.UTF-8"

    export PGDATA=$PWD/db
    export PGHOST=$PWD/postgres
    export PGDATABASE=nix_shell
    export PGPORT=35432
    export USER=postgres
    export PASSWORD=postgres

    export DATABASE_URL="postgresql://$USER:$PASSWORD@localhost:$PGPORT/$PGDATABASE"
    export LOG_PATH=$PWD/postgres/LOG

    if [ ! -d $PGHOST ]; then
      mkdir -p $PGHOST
    fi

    if [ ! -d $PGDATA ]; then
      initdb --auth=trust --no-locale --encoding=UTF8
    fi

    postgres_start() {
      if ! pg_ctl status
      then
        pg_ctl start -l $LOG_PATH -o "-c unix_socket_directories='$PGHOST'"
      fi
    }

    postgres_setup() {
      postgres_start
      createdb $PGDATABASE
      psql -c "CREATE ROLE $USER WITH LOGIN SUPERUSER PASSWORD '$PASSWORD';"
    }
  '';
}
