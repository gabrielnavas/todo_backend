-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.3-beta1
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: todo | type: DATABASE --
-- DROP DATABASE IF EXISTS todo;
CREATE DATABASE todo
	ENCODING = 'UTF8'
	LC_COLLATE = 'en_US.utf8'
	LC_CTYPE = 'en_US.utf8'
	TABLESPACE = pg_default
	OWNER = postgres;
-- ddl-end --
COMMENT ON DATABASE todo IS E'default administrative connection database';
-- ddl-end --


-- object: public.user_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS public.user_id_seq CASCADE;
CREATE SEQUENCE public.user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE public.user_id_seq OWNER TO postgres;
-- ddl-end --

-- object: public."user" | type: TABLE --
-- DROP TABLE IF EXISTS public."user" CASCADE;
CREATE TABLE public."user" (
	id integer NOT NULL DEFAULT nextval('public.user_id_seq'::regclass),
	name character varying(30) NOT NULL,
	email character varying(70) NOT NULL,
	password character varying(72) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public."user" OWNER TO postgres;
-- ddl-end --

-- object: public.user_token_access | type: TABLE --
-- DROP TABLE IF EXISTS public.user_token_access CASCADE;
CREATE TABLE public.user_token_access (
	id serial NOT NULL,
	id_user integer NOT NULL,
	token varchar(8192) NOT NULL,
	created_at timestamptz NOT NULL,
	invalid_at timestamptz,
	CONSTRAINT user_token_access_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.user_token_access OWNER TO postgres;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE public.user_token_access DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE public.user_token_access ADD CONSTRAINT user_fk FOREIGN KEY (id_user)
REFERENCES public."user" (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: public.todo_item | type: TABLE --
-- DROP TABLE IF EXISTS public.todo_item CASCADE;
CREATE TABLE public.todo_item (
	id serial NOT NULL,
	id_name_area varchar(60) NOT NULL,
	title varchar(100) NOT NULL,
	description varchar(255) NOT NULL,
	id_user integer NOT NULL,
	CONSTRAINT todo_item_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.todo_item OWNER TO postgres;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE public.todo_item DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE public.todo_item ADD CONSTRAINT user_fk FOREIGN KEY (id_user)
REFERENCES public."user" (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "grant_CU_eb94f049ac" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO postgres;
-- ddl-end --

-- object: "grant_CU_cd8e46e7b6" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO PUBLIC;
-- ddl-end --


