import React from 'react';
import { NextSeo } from 'next-seo';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout title="About">
      <NextSeo
        title="About"
        description="Learn more about BikiNinjas Blog and our mission."
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About BikiNinjas
        </h1>
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            Welcome to BikiNinjas Blog, a place where we explore various topics
            including society, mental health, video games, programming, game
            development, and modding games.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide insightful, informative, and engaging
            content across a variety of topics that interest our community. We
            believe in the power of knowledge sharing and aim to create a space
            where readers can learn, grow, and connect.
          </p>
          
          <h2>Our Categories</h2>
          <ul>
            <li>
              <strong>Society</strong>: Exploring social issues, cultural
              phenomena, and the world around us.
            </li>
            <li>
              <strong>Mental Health</strong>: Discussing mental wellbeing,
              self-care strategies, and raising awareness about mental health
              issues.
            </li>
            <li>
              <strong>Video Games</strong>: Reviews, analyses, and discussions
              about the latest and greatest in the gaming world.
            </li>
            <li>
              <strong>Programming</strong>: Tutorials, tips, and insights into
              the world of coding and software development.
            </li>
            <li>
              <strong>Game Dev</strong>: Behind-the-scenes looks at game
              development, from concept to execution.
            </li>
            <li>
              <strong>Modding Games</strong>: Guides, resources, and showcases of
              game modifications and customizations.
            </li>
          </ul>
          
          <h2>Join Our Community</h2>
          <p>
            We're more than just a blog—we're a community of like-minded
            individuals who share a passion for learning and exploration. We
            invite you to join us on this journey by reading our articles,
            sharing your thoughts, and connecting with us on social media.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            Have questions, suggestions, or just want to say hello? We'd love to
            hear from you! Reach out to us at{' '}
            <a href="mailto:contact@bikininjas.com">contact@bikininjas.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
