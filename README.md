# Keystone Project Starter

Welcome to Keystone!

Run

```
npm run dev
```

To view the config for your new app, look at [./keystone.ts](./keystone.ts)

This project starter is designed to give you a sense of the power Keystone can offer you, and show off some of its main features. It's also a pretty simple setup if you want to build out from it.

We recommend you use this alongside our [getting started walkthrough](https://keystonejs.com/docs/walkthroughs/getting-started-with-create-keystone-app) which will walk you through what you get as part of this starter.

If you want an overview of all the features Keystone offers, check out our [features](https://keystonejs.com/why-keystone#features) page.

## Some Quick Notes On Getting Started

### Changing the database

We've set you up with an [SQLite database](https://keystonejs.com/docs/apis/config#sqlite) for ease-of-use. If you're wanting to use PostgreSQL, you can!

Just change the `db` property on line 16 of the Keystone file [./keystone.ts](./keystone.ts) to

```typescript
db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL || 'DATABASE_URL_TO_REPLACE',
}
```

And provide your database url from PostgreSQL.

For more on database configuration, check out or [DB API Docs](https://keystonejs.com/docs/apis/config#db)

### Auth

We've put auth into its own file to make this humble starter easier to navigate. To explore it without auth turned on, comment out the `isAccessAllowed` on line 21 of the Keystone file [./keystone.ts](./keystone.ts).

For more on auth, check out our [Authentication API Docs](https://keystonejs.com/docs/apis/auth#authentication-api)

### Adding a frontend

As a Headless CMS, Keystone can be used with any frontend that uses GraphQL. It provides a GraphQL endpoint you can write queries against at `/api/graphql` (by default [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)). At Thinkmill, we tend to use [Next.js](https://nextjs.org/) and [Apollo GraphQL](https://www.apollographql.com/docs/react/get-started/) as our frontend and way to write queries, but if you have your own favourite, feel free to use it.

A walkthrough on how to do this is forthcoming, but in the meantime our [todo example](https://github.com/keystonejs/keystone-react-todo-demo) shows a Keystone set up with a frontend. For a more full example, you can also look at an example app we built for [Prisma Day 2021](https://github.com/keystonejs/prisma-day-2021-workshop)

### Embedding Keystone in a Next.js frontend

While Keystone works as a standalone app, you can embed your Keystone app into a [Next.js](https://nextjs.org/) app. This is quite a different setup to the starter, and we recommend checking out our walkthrough for that [here](https://keystonejs.com/docs/walkthroughs/embedded-mode-with-sqlite-nextjs#how-to-embed-keystone-sq-lite-in-a-next-js-app).

# Bienvenue sur Bikininjas 🏄‍♂️💻

Ce blog est construit avec amour (et un peu de sarcasme) en utilisant les technologies suivantes :

## 🛠️ Technologies utilisées

### **Keystone.js** 🏰

Notre framework de choix pour gérer le contenu de manière élégante. Parce que oui, on aime les châteaux, mais surtout les châteaux de code.

### **TypeScript** 📜

Parce que JavaScript, c'est bien, mais TypeScript, c'est mieux. On aime quand le code est bien typé, comme un bon vin. 🍷

### **Markdown** 📝

Pour écrire nos articles avec style et simplicité. Parce que parfois, on a juste envie de se concentrer sur le contenu, pas sur la mise en page.

### **Git** 🐙

Pour versionner notre code comme des pros. Parce que perdre du code, c'est comme perdre ses clés : ça arrive, mais c'est très énervant. 🔑

### **Et bien plus...** 🎉

On utilise aussi une tonne d'autres outils et bibliothèques pour rendre ce blog aussi cool que possible. Parce que dans le monde de la tech, il faut toujours rester à la pointe (ou au moins essayer).

## 🚀 Comment contribuer ?

Si tu veux ajouter ton grain de sel (ou de code), n'hésite pas à forker ce repo et à nous envoyer une pull request. On adore les contributions, surtout si elles viennent avec des gifs drôles.

## 📜 Licence

Ce projet est sous licence MIT. En gros, tu peux faire ce que tu veux avec, mais on apprécierait un petit crédit. Parce que c'est sympa, et que ça fait plaisir. 😊

---

Alors, prêt à plonger dans le code ? 🌊 Attache ta ceinture, mets ton casque de réalité virtuelle, et prépare-toi à une aventure où le code rencontre la créativité, et où le sarcasme est toujours de mise. Bienvenue chez les Bikininjas, où on ne fait pas que surfer sur le web, on le modifie. 🏄‍♂️💻
