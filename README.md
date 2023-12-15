# Ryuutama

Ryuutama system for FoundryVTT

- Dependency manager : pnpm
- Style Sheet : Sass

Ticket tracker : https://trello.com/b/0NBRFMG5/ryuutama

# Functionalities

## Xp management

By using the XP item type and dropping it over a character sheet, the character will earn that much XP, the level will be recalculated and on level up augmentations will be displayed to the player.

Negative Xp value is also handled with level down

TODO:

- on level up, all to make choices in the window instead of manual changes
- on level down, remove the augmentations

## Spell Casting

On drop of a spell on the character sheet, it will appear on the character sheet

On click on the image of a spell it will be displayed in the chat and can then be cast from the chat if the character has enough MP

## Character Type

On drop of a character type on a character sheet, the abilities will be added to the player

TODO:

- check that the character doesn't already have the same type two avoid duplicates
- apply the abilities to the character sheet (ActiveEffect? Adjust directly the stat of the character sheet)

## Skill usage

On drop of a Skill on character sheet, it will be added to that player sheet.

By clicking on the skill picture you will display it in chat. From here you can roll any skills linked to the skill.

## Rolls

the rolls allow the player to concentrate using fumble point or MP or both.

On fumble, all the players will earn one fumble point

## Equipment Usage

## Item Types

## Character Types
