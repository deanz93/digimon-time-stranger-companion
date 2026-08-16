export type Mission={id:string;title:string;kind:'Main'|'Side'|'Post-game'|'DLC';chapter:string;location:string;unlock?:string;summary:string;steps:string[];tips:string[]};

const mainGroups:[string,string[]][]=[
['Introduction',['ADAMAS','Signs of an Anomaly','The View after the End']],
['Tokyo — Eight Years Ago',['Reunions Bring Trouble','The Time Stranger','Resonating Thoughts','Genius or Crackpot?','A Vow Made on a Starry Sky','Shinjuku Rhapsody','The In-Between','Truth Born from an Egg']],
['Digital World — Eight Years Ago',['To the Untrodden World','Rumble in the Underground','Gathering Storm Clouds','Incoming Conflict','Audience with an Oracle','On the Shores of Another World',"The World Tree's Cry",'War!']],
['Attack on Nishi-Shinjuku',['The Beginning of the End','The Defense of Nishi-Shinjuku']],
['Tokyo — Present Day',['Revelation in the White Light','Re: The Time Stranger','8 Years']],
['Digital World — Present Day',['On My Life','Metamorphosis','Red Seas and Regret','A Promise on a Scarf','Class-S Anomalies','Too Late',"The Titans' Grudge",'The Destruction of All Order','The Paradise Colosseum','The Violence of Humans','Where Did the Ribbon Go?']],
['Endgame',["The God of Speed's Wish",'Throne of the Underworld','No Cure for Stupidity','Fire and Ice at War','The Mad Oracle','The Cycle of Time','The Final Battle Over the Natural Order']]
];
const sideGroups:[string,string[]][]=[
['Tokyo — Eight Years Ago',['Mystery of the Missing T-Shirt','The Targeted Cosplayer','Infinite Imagination','To Do the Job, You Need to Dress the Part','The Secret Getaway','The Father of Shinjuku','Between the Worlds']],
['Central Town — Eight Years Ago',['A Delayed Return',"The Blacksmith's Request",'Knowledge is the Death of Fear','From Pegasusmon to the World',"The Craftsman's Partner",'The Trial',"PlatinumNumemon's Jewelry",'Impatience and Determination']],
['Factorial Area — Eight Years Ago',['Back to the Skies','Quick to Fight, Quick on the Job','I Want to Go Someplace Legendary!']],
['Abyss Area — Eight Years Ago',['Proper Beach Attire','The Color the Water Speaks Of','A Missing Friend',"Divermon's Woes"]],
['Gear Forest — Eight Years Ago',['The Mighty Bearmon Brothers','Secret of the Hidden Honey Base']],
['Tokyo — Present Day',['Stuck in the Restroom','In the Palm of an Unknown Hand']],
['Gear Forest — Present Day',['Message From Beyond Time','Hidden Honey Base Strikes Back']],
['Abyss Area — Present Day',['Listen to the Voice']],
['Factorial Area — Present Day',['How to Cheer Up a Warrior','The Easy Road Is Best']],
['Central Town — Present Day',["I Don't Belong Anywhere Yet"]]
];
const postGroups:[string,string[]][]=[
['Post-game Unlock',['A Gift from the Hosts']],
["Minervamon's Mission Line",['What Is Love?','Premonitions of Love','Triumph is Mine',"Minervamon's Decision"]],
["Hiroko's Mission Line",['Scariest Face in the World','Fulfilling a Great Ambition','Observing the Underworld','An Odd Letter']],
['Royal Knights, Assemble!',['Royal Knights, Assemble!',"Knowing One's Strength",'Showdown with the Immortal Steed',"One Shield Maker's Struggle","Veemon's Growth",'Bring Your Own Materials','The Call of the Unseen','The Worthy','Duels Must Be Fair',"A Facilitator's Woes",'The Pinnacle of the Card World','A Stubborn Fighter?','Yaro-Kei Ramen',"Blink and You'll Miss It",'The Beautiful Knight Corps','Choosing a Human Representative!','Alpha and Omega']],
['Helper from Shambala',['The Helper from Shambala','The Forgetful Helpers','Susanomon the Hero']],
['Collectathon',['All Eyes on Me!','Dreams or Reality?','Silent Envy']],
['Other Post-game',['Encounters Beyond Space-Time',"Olympos XII's Test Match",'Longing for Akihabara','Memories of Bonds','Secrets are for Sharing','To My Dearest','Find a Lead Vocalist!','Fertilizer for the Soul','A Stubborn Fog','Final Battle Challenger','A Display of Beautiful Swordplay','The Greatest OMNI Carnival']]
];

const special:Record<string,Partial<Pick<Mission,'summary'|'steps'|'tips'|'unlock'>>>={
  ADAMAS:{summary:'Begin the ADAMAS investigation and learn the basic field controls, Digivice and mission marker system.',steps:['Choose the protagonist appearance and name; both can be changed later in Game Settings.','After the opening call, open the Digivice and review the active mission.','Follow the objective waypoints through Tokyo to the investigation coordinates.','Interact with each marked point and continue after the final event.'],tips:['The Digivice gradually gains more features as the story advances.','Use the active objective marker whenever the route is unclear.']},
  "The World Tree's Cry":{tips:['A Vaccine-heavy party is useful here.','Electric skills are especially helpful for the major encounter.','Save and restore SP before advancing past the final objective marker.']},
  'Truth Born from an Egg':{tips:['This closes the Tokyo — Eight Years Ago main-story block.','Finish any currently available side missions before advancing if you want to clear them in chronological order.']},
  'A Gift from the Hosts':{summary:'Complete the post-story unlock mission to gain time-travel access and open the wider post-game mission catalogue.',unlock:'Complete the main story.',steps:['Load the cleared-game save and check the newly delivered mission notice.','Follow the marked post-game event until the hosts finish their explanation.','Complete the required encounter and watch the closing event.','Confirm that time travel is available, then revisit both eras for newly unlocked missions.'],tips:['Do this first after the ending; most post-game mission lines depend on its time-travel unlock.']},
  'Longing for Akihabara':{steps:['Unlock post-game time travel through A Gift from the Hosts.','Travel to the Factorial Area in the Eight Years Ago era.','Speak with Vulcanusmon in his quarters to begin the request.','Follow the active markers and return after obtaining the requested item.'],tips:['Make sure the mission is tracked before changing eras so its markers remain easy to follow.']},
  "PlatinumNumemon's Jewelry":{summary:'Track down the missing PlatinumNumemon and its jewelry, then report back to the Bearmon Brothers.',steps:['Accept the request in Central Town and speak with the Bearmon Brothers.','Track the mission and follow the search markers for the hiding PlatinumNumemon.','Resolve the encounter and recover the jewelry.','Return to the Bearmon Brothers in Central Town to finish the mission.'],tips:['Check every marked branch of the search area before leaving; the quest resolves only after the jewelry is recovered.']}
};

function baseSteps(kind:Mission['kind'],title:string,chapter:string,index:number):string[]{
  if(kind==='Main')return[`Open the Digivice, track “${title}”, and follow the story marker in ${chapter}.`,'Speak with every marked character and exhaust the highlighted dialogue choices.','Explore the newly opened route; activate nearby travel points and collect visible chests before the final marker.','Prepare the party when the objective changes to a battle or restricted area, then clear the scripted encounter.',`Watch the closing event and confirm the next main mission is active${index===0?' for this chapter':''}.`];
  if(kind==='Side')return[`Accept “${title}” from its mission notice or marked requester in ${chapter}.`,'Set it as the tracked mission and speak with the requester for the full objective.','Follow the blue side-mission markers; inspect each highlighted person, object or search area.','Complete the requested battle, delivery or investigation when the objective updates.','Return to the requester if prompted and confirm the completion reward screen.'];
  if(kind==='Post-game')return[`After unlocking time travel, accept “${title}” and set it as the tracked mission.`,`Travel to the era and area indicated by the mission marker for the ${chapter} line.`,'Complete each marked conversation or collection objective before entering the battle area.','Use a high-level balanced party for the post-game encounter and save before the final marker.','Report back, collect the reward and check for the next mission in this questline.'];
  return[`Install the episode pack, start “${title}” from the downloadable episode menu and track it.`,'Read the opening briefing and travel to the newly marked episode area.','Clear the episode objectives in marker order and prepare before each restricted-area warning.','Defeat the episode encounter, watch its closing event and confirm its rewards or evolution unlocks.'];
}

function build(groups:[string,string[]][],kind:Mission['kind']):Mission[]{return groups.flatMap(([chapter,titles])=>titles.map((title,index)=>{const fallbackSummary=kind==='Main'?`Advance the ${chapter} story arc by following the active objective chain for “${title}”.`:kind==='Side'?`Complete the optional “${title}” request in ${chapter}.`:`Continue the ${chapter} post-game questline with “${title}”.`;const extra=special[title]??{};return{id:`${kind}-${chapter}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g,'-'),title,kind,chapter,location:chapter,unlock:extra.unlock??(kind==='Post-game'?'Complete the story and then finish A Gift from the Hosts to unlock time travel.':undefined),summary:extra.summary??fallbackSummary,steps:extra.steps??baseSteps(kind,title,chapter,index),tips:extra.tips??(kind==='Main'?['Save before entering a restricted story area.','Keep at least one Data, Vaccine and Virus attacker ready so boss attributes do not lock the party into a poor matchup.']:['Track only one optional mission at a time so its markers remain clear.'])}}));}

const dlc:Mission[]=['Episode I: Alternate Dimension','Episode II: GAKU-RAN','Episode III: Anti-ParadoX'].map((title,index)=>({id:`dlc-${index+1}`,title,kind:'DLC',chapter:'Downloadable Episodes',location:'Episode-specific area',unlock:'Install the corresponding Additional Digimon & Episode Pack, then progress far enough for downloadable episodes to appear.',summary:`Play the self-contained ${title} downloadable story and unlock its episode rewards.`,steps:baseSteps('DLC',title,'Downloadable Episodes',index),tips:['DLC encounters can be attempted independently, but a late-game party is recommended.','Verify the installed game version and add-on ownership if the episode does not appear.']}));

export const missions:Mission[]=[...build(mainGroups,'Main'),...build(sideGroups,'Side'),...build(postGroups,'Post-game'),...dlc];
