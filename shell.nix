{ pkgs ? import <nixpkgs> { } }:

with pkgs;

mkShell { buildInputs = [ docker docker-compose ]; }
