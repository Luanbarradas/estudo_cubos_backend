create database dindin;

create table usuarios (
id serial primary key,
nome varchar(255) not null,
email varchar(255) unique not null,
senha varchar(255) not null
);

create table categorias (
id serial primary key,
descricao varchar(255) not null
);

create table transacoes (
id serial primary key,
descricao varchar(255) not null,
valor integer not null,
data timestamp not null,
catagoria_id integer references categorias(id) not null,
usuario_id integer references categorias(id) not null,
tipo text not null
);

insert into categorias (descricao) values
('Alimentação'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');