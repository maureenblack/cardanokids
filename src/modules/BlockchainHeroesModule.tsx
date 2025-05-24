import React from 'react';

// Define the module content for Blockchain Heroes
const BlockchainHeroesModule = {
  young: {
    title: 'Blockchain Heroes',
    description: 'Join Ada and her friends on an adventure to learn how blockchain heroes keep the network safe!',
    character: 'Captain Block',
    characterImage: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
    steps: [
      {
        title: 'Meet the Blockchain Heroes',
        content: 'In the digital world of Cardano, special heroes work together to keep the blockchain safe and secure. Captain Block leads the team of heroes who make sure all transactions are valid and that no one can cheat the system. Today, Captain Block wants to introduce you to the heroes and show you how they work together!',
        activity: {
          type: 'interactive',
          component: 'BlockchainStorybook',
          props: {
            title: 'The Blockchain Heroes',
            description: 'Meet the heroes who keep the blockchain safe!',
            pages: [
              {
                title: 'Captain Block: The Leader',
                content: 'Captain Block is the leader of the Blockchain Heroes. He organizes the team and makes sure everyone is doing their job to keep the blockchain secure. Captain Block loves to build strong chains of blocks that can\'t be broken!',
                image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
                character: {
                  name: 'Captain Block',
                  image: 'https://img.freepik.com/free-vector/cute-astronaut-superhero-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3900.jpg',
                  description: 'I make sure our blockchain is strong and secure!',
                  role: 'Team Leader'
                }
              },
              {
                title: 'Validator Vera: The Checker',
                content: 'Validator Vera checks every transaction to make sure it follows the rules. She makes sure no one is trying to cheat by spending tokens they don\'t have. Vera is very careful and never approves a transaction unless she\'s sure it\'s valid.',
                image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
                character: {
                  name: 'Validator Vera',
                  image: 'https://img.freepik.com/free-vector/cute-girl-detective-cartoon-vector-icon-illustration-people-profession-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3329.jpg',
                  description: 'I check every transaction to make sure it follows the rules!',
                  role: 'Transaction Validator'
                }
              },
              {
                title: 'Hash Hero: The Protector',
                content: 'Hash Hero uses special math powers to create unique codes called "hashes" that protect the information in each block. These hashes are like special locks that keep the blockchain secure. If anyone tries to change something in a block, Hash Hero will know right away!',
                image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
                character: {
                  name: 'Hash Hero',
                  image: 'https://img.freepik.com/free-vector/cute-robot-wearing-glasses-cartoon-vector-icon-illustration-technology-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3717.jpg',
                  description: 'My special hash codes keep our blockchain secure!',
                  role: 'Security Specialist'
                }
              },
              {
                title: 'Consensus Crew: The Decision Makers',
                content: 'The Consensus Crew is a team of heroes who work together to make decisions. When there\'s a new block to add to the chain, the Consensus Crew votes on whether it should be added. They make sure everyone agrees before any changes are made to the blockchain.',
                image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
                character: {
                  name: 'Consensus Crew',
                  image: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-metaverse-illustration_23-2149243576.jpg',
                  description: 'We work together to make important decisions for the blockchain!',
                  role: 'Decision Making Team'
                }
              },
              {
                title: 'The Blockchain Heroes in Action',
                content: 'When all the Blockchain Heroes work together, they create a secure and trustworthy blockchain that everyone can use. Captain Block leads the team, Validator Vera checks the transactions, Hash Hero protects the information, and the Consensus Crew makes sure everyone agrees on what happens next. Together, they\'re unstoppable!',
                image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
                character: {
                  name: 'The Blockchain Heroes',
                  image: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-metaverse-illustration_23-2149243576.jpg',
                  description: 'Together, we keep the blockchain safe and secure for everyone!',
                  role: 'Blockchain Protectors'
                }
              }
            ]
          }
        }
      },
      {
        title: 'Validator Vera\'s Challenge',
        content: 'Validator Vera needs your help! She has a lot of transactions to check, and she needs to make sure they all follow the rules. Can you help her validate these transactions and keep the blockchain secure?',
        activity: {
          type: 'interactive',
          component: 'BlockchainValidator',
          props: {
            title: 'Validator Vera\'s Challenge',
            description: 'Help Validator Vera check transactions to make sure they follow the rules!',
            difficulty: 'easy'
          }
        }
      },
      {
        title: 'Building Secure Blocks',
        content: 'Captain Block needs your help to build strong, secure blocks for the blockchain. Each block needs to contain valid transactions and be connected to the previous block with a special hash code. Let\'s help Captain Block build a secure blockchain!',
        activity: {
          type: 'interactive',
          component: 'BlockchainBuilder',
          props: {
            title: 'Build with Captain Block',
            description: 'Help Captain Block build secure blocks for the blockchain!',
            difficulty: 'easy',
            blockCount: 3
          }
        }
      },
      {
        title: 'Hash Hero\'s Secret Codes',
        content: 'Hash Hero uses special math to create unique codes called "hashes" that protect the information in each block. These hashes are like fingerprints - no two are exactly alike! Let\'s help Hash Hero create some hash codes and see how they work.',
        activity: {
          type: 'interactive',
          component: 'HashGenerator',
          props: {
            title: 'Hash Hero\'s Secret Codes',
            description: 'Help Hash Hero create special hash codes to protect the blockchain!',
            simpleMode: true
          }
        }
      },
      {
        title: 'The Consensus Game',
        content: 'The Consensus Crew needs to make decisions together to keep the blockchain running smoothly. Let\'s play a game to learn how the Consensus Crew works together to agree on which blocks to add to the chain.',
        activity: {
          type: 'craft',
          title: 'Consensus Card Game',
          description: 'Play a card game to learn how blockchain consensus works!',
          instructions: [
            'Each player gets 5 cards with different transactions.',
            'Players take turns suggesting which transaction should be added next.',
            'Everyone votes on whether to accept or reject the transaction.',
            'If most players agree, the transaction is added to the blockchain.',
            'The first player to add all their transactions wins!'
          ]
        }
      },
      {
        title: 'Blockchain Heroes in Action',
        content: 'Now that you\'ve met all the Blockchain Heroes and learned how they work together, let\'s see them in action! Watch this short video to see how the Blockchain Heroes protect the blockchain and keep everything running smoothly.',
        activity: {
          type: 'interactive',
          component: 'video',
          props: {
            title: 'Blockchain Heroes in Action',
            videoUrl: 'https://www.youtube.com/embed/SSo_EIwHSd4',
            description: 'Watch the Blockchain Heroes protect the blockchain!'
          }
        }
      },
      {
        title: 'Create Your Own Blockchain Hero',
        content: 'Now it\'s your turn to create your own Blockchain Hero! What special powers would your hero have? How would they help protect the blockchain? Draw your hero and share their story with the class!',
        activity: {
          type: 'craft',
          title: 'Design Your Blockchain Hero',
          description: 'Create your own Blockchain Hero with special powers to protect the blockchain!',
          instructions: [
            'Draw your Blockchain Hero and give them a name.',
            'Decide what special blockchain power they have.',
            'Write a short story about how your hero helps protect the blockchain.',
            'Share your hero with the class!'
          ]
        }
      },
      {
        title: 'Test Your Knowledge',
        content: 'Now it\'s time to show what you\'ve learned about the Blockchain Heroes and how they keep the blockchain safe! Take this quiz to test your knowledge and earn your very own Blockchain Hero NFT Certificate!',
        activity: {
          type: 'interactive',
          component: 'QuizComponent',
          props: {
            title: 'Blockchain Heroes Quiz',
            description: 'Test your knowledge about the Blockchain Heroes!',
            questions: [
              {
                question: 'Who is the leader of the Blockchain Heroes?',
                options: ['Captain Block', 'Validator Vera', 'Hash Hero', 'Consensus Crew'],
                correctAnswer: 0
              },
              {
                question: 'What does Validator Vera do?',
                options: ['Creates hash codes', 'Checks transactions', 'Makes decisions', 'Builds blocks'],
                correctAnswer: 1
              },
              {
                question: 'What special codes does Hash Hero create?',
                options: ['Secret messages', 'Passwords', 'Hashes', 'Tokens'],
                correctAnswer: 2
              },
              {
                question: 'What does the Consensus Crew do?',
                options: ['Build blocks', 'Create tokens', 'Make decisions together', 'Write smart contracts'],
                correctAnswer: 2
              },
              {
                question: 'Why is it important for blockchain heroes to work together?',
                options: ['To make more tokens', 'To keep the blockchain secure', 'To build faster computers', 'To create more blocks'],
                correctAnswer: 1
              }
            ],
            certificateInfo: {
              title: 'Blockchain Hero',
              description: 'Awarded for learning about the Blockchain Heroes and how they protect the blockchain!',
              image: 'https://img.freepik.com/free-vector/gradient-superhero-twitch-background_23-2149192541.jpg',
              moduleId: 'blockchain-heroes'
            }
          }
        }
      }
    ]
  },
  middle: {
    title: 'Blockchain Security Specialists',
    description: 'Learn about the different roles that help keep a blockchain secure and trustworthy.',
    character: 'Security Specialist Sarah',
    characterImage: 'https://img.freepik.com/free-vector/cute-girl-detective-cartoon-vector-icon-illustration-people-profession-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3329.jpg',
    steps: [
      {
        title: 'Introduction to Blockchain Security',
        content: 'Blockchain technology is designed to be secure by nature, but it still requires different security specialists to ensure everything runs smoothly. In this module, we\'ll learn about the different roles that help keep a blockchain secure and trustworthy.',
        activity: {
          type: 'interactive',
          component: 'BlockchainStorybook',
          props: {
            title: 'Blockchain Security Team',
            description: 'Meet the specialists who keep the blockchain secure!',
            pages: [
              {
                title: 'The Security Challenge',
                content: 'Blockchains need to be secure so that people can trust them with important information and valuable assets. Security Specialist Sarah will introduce us to the team that works together to keep the Cardano blockchain safe from attacks and errors.',
                image: 'https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148865392.jpg',
                character: {
                  name: 'Security Specialist Sarah',
                  image: 'https://img.freepik.com/free-vector/cute-girl-detective-cartoon-vector-icon-illustration-people-profession-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3329.jpg',
                  description: 'I coordinate the security team to protect our blockchain from threats!',
                  role: 'Security Coordinator'
                }
              }
            ]
          }
        }
      }
    ]
  },
  older: {
    title: 'Blockchain Security Principles',
    description: 'A deep dive into the technical security mechanisms that protect blockchain networks.',
    character: 'Cybersecurity Expert',
    characterImage: 'https://img.freepik.com/free-vector/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style_138676-2387.jpg',
    steps: [
      {
        title: 'Introduction to Blockchain Security',
        content: 'Blockchain security is built on several key principles that work together to create a secure and trustworthy system. In this module, we\'ll explore these principles and understand how they protect blockchain networks from various threats.',
        activity: {
          type: 'interactive',
          component: 'BlockchainStorybook',
          props: {
            title: 'Blockchain Security Principles',
            description: 'Explore the technical security mechanisms of blockchain networks',
            pages: [
              {
                title: 'The Security Challenge',
                content: 'Blockchain networks face various security challenges, including double-spending attacks, 51% attacks, smart contract vulnerabilities, and more. Understanding these threats and the mechanisms to prevent them is crucial for anyone working with blockchain technology.',
                image: 'https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148865392.jpg',
                character: {
                  name: 'Dr. Secure',
                  image: 'https://img.freepik.com/free-vector/hacker-operating-laptop-cartoon-icon-illustration-technology-icon-concept-isolated-flat-cartoon-style_138676-2387.jpg',
                  description: 'I research and develop advanced security protocols for blockchain systems.',
                  role: 'Blockchain Security Researcher'
                }
              }
            ]
          }
        }
      }
    ]
  }
};

export default BlockchainHeroesModule;
