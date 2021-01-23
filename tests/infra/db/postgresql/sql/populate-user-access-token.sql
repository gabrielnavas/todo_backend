-- for populate user token access
do $$ 
declare
  	user_id_navas numeric;
	user_id_jose numeric;
	user_id_ronaldo numeric;
begin 
	
	DELETE FROM public."user_token_access" CASCADE;
    DELETE FROM public."user" CASCADE;

	insert into public."user" (email, name, password) values ('navas@email.com', 'navas', '123456') RETURNING id INTO user_id_navas;
	insert into public."user" (email, name, password) values ('jose@email.com', 'jose', '123456') RETURNING id INTO user_id_jose;
	insert into public."user" (email, name, password) values ('ronaldo@email.com', 'ronaldo', '123456') RETURNING id INTO user_id_ronaldo;

	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_navas, 'any_token_navas1', now(), now());
	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_navas, 'any_token_navas2', now(), now());
	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_navas, 'any_token_navas3', now(), now());
	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_jose, 'any_token_jose1', now(), now());
	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_jose, 'any_token_jose2', now(), now());
	insert into public.user_token_access(id_user, token, created_at, invalid_at) values(user_id_ronaldo, 'any_token_ronaldo1', now(), now());

end; $$


