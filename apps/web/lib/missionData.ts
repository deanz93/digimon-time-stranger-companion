export type Mission={id:string;title:string;kind:'Main'|'Side'|'Post-game'|'DLC';chapter:string;location?:string;unlock?:string;summary:string;sourceUrl:string};
const source='https://www.neoseeker.com/digimon-story-time-stranger/walkthrough';
const slug=(s:string)=>s.replace(/[?!.:,]/g,'').replace(/['’]/g,'%27').replace(/\s+/g,'_');
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
const sideSource:Record<string,string>={
'Tokyo — Eight Years Ago':'Tokyo_Eight_Years_Ago_Side_Missions','Central Town — Eight Years Ago':'Central_Town_Eight_Years_Ago_Side_Missions','Factorial Area — Eight Years Ago':'Factorial_Area_Eight_Years_Ago_Side_Missions','Abyss Area — Eight Years Ago':'Abyss_Area_Eight_Years_Ago_Side_Missions','Gear Forest — Eight Years Ago':'Gear_Forest_Eight_Years_Ago_Side_Missions','Tokyo — Present Day':'Tokyo_Present_Day_Side_Missions','Gear Forest — Present Day':'Gear_Forest_Present_Day_Side_Missions','Abyss Area — Present Day':'Abyss_Area_Present_Day_Side_Missions','Factorial Area — Present Day':'Factorial_Area_Present_Day_Side_Missions','Central Town — Present Day':'Central_Town_Present_Day_Side_Missions'};
const postSource:Record<string,string>={'Post-game Unlock':'Post-Game',"Minervamon's Mission Line":'Minervamon%27s_Post-Game_Side_Missions',"Hiroko's Mission Line":'Hiroko%27s_Post-Game_Side_Missions','Royal Knights, Assemble!':'Royal_Knights_Assemble','Helper from Shambala':'Helper_from_Shambala','Collectathon':'Post-Game','Other Post-game':'Other_Post-Game_Side_Missions'};
const make=(groups:[string,string[]][],kind:Mission['kind'])=>groups.flatMap(([chapter,titles])=>titles.map((title,index):Mission=>({id:`${kind}-${chapter}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g,'-'),title,kind,chapter,location:chapter,unlock:kind==='Post-game'?'Complete the story and unlock time travel through A Gift from the Hosts.':undefined,summary:kind==='Main'?`Story mission ${index+1} in ${chapter}. Follow the linked verified walkthrough for objective order, navigation, puzzles and boss preparation.`:`Optional mission in ${chapter}. Use the linked source for confirmed unlock conditions, objectives, rewards and battle details.`,sourceUrl:kind==='Main'?`${source}/${slug(title)}`:`https://www.neoseeker.com/digimon-story-time-stranger/guides/${kind==='Post-game'?postSource[chapter]:sideSource[chapter]}`})));
export const missions:Mission[]=[...make(mainGroups,'Main'),...make(sideGroups,'Side'),...make(postGroups,'Post-game'),
...['Episode I: Alternate Dimension','Episode II: GAKU-RAN','Episode III: Anti-ParadoX'].map((title,i):Mission=>({id:`dlc-${i+1}`,title,kind:'DLC',chapter:'Downloadable Episodes',unlock:'Install the corresponding Additional Digimon & Episode Pack and progress far enough to access downloadable episodes.',summary:'Official downloadable story episode. The linked guide index provides access instructions and its complete mission sequence.',sourceUrl:source}))];
