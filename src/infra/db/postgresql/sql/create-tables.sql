-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.3-beta1
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: todo | type: DATABASE --
DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo;
-- ddl-end --


-- object: public."user" | type: TABLE --
DROP TABLE IF EXISTS public."user" CASCADE;
CREATE TABLE public."user" (
	id serial NOT NULL,
	name varchar(30) NOT NULL,
	email varchar(70) NOT NULL,
	password varchar(72) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."user" OWNER TO postgres;
-- ddl-end --


