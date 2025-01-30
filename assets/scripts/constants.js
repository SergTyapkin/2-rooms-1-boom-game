// Allowed only absolute (starts with '/' or 'http(s)://') urls
// or relative urls without '../' or './' (example: 'path/index.html')
export const AllCachableResources = [
  'index.html',
  'role.html',
  'search.html',
  'start.html',
  'card.html',

  'assets/scripts/constants.js',
  'assets/scripts/SWTools.js',
  'assets/styles/index.css',

  'assets/vendor/qrcodeGenerator.js',
  'assets/vendor/qrcodeScanner.min.js',
  'assets/vendor/qr-scanner-worker.min.js',

  'assets/images/admin.svg',
  'assets/images/bomb.svg',
  'assets/images/download.svg',
  'assets/images/favicon.svg',
  'assets/images/info.svg',
  'assets/images/list.svg',
  'assets/images/people.svg',
  'assets/images/person.svg',
  'assets/images/player.svg',
  'assets/images/info_card.svg',
  'assets/images/person_effect.svg',
  'assets/images/shield_person.svg',
  'assets/images/change_card.svg',
  'assets/images/warning.svg',

  'assets/images/hidden-texture.png',

  'assets/fonts/ALS_Sector/ALS_Sector_Bold.ttf',
  'assets/fonts/ALS_Sector/ALS_Sector_Bold.woff',
  'assets/fonts/ALS_Sector/ALS_Sector_Regular.ttf',
  'assets/fonts/ALS_Sector/ALS_Sector_Regular.woff',
];


export const QueryParamsNames = {
  roles: 'roles',
  role: 'role',
  isEasyMode: 'iseasy',
}

export const ROLES_LIST_TEAM_DELIMITER = '_';
export const ROLES_LIST_ROLES_DELIMITER = '.';

export const Teams = {
  red: 'R',
  blue: 'B',
  grey: 'G',
  both: 'RB',
};

export const LocalStorageNames = {
  isEasyMode: 'is-easy-mode',
  playersCount: 'players-count',
  myRole: 'my-role',
  rolesConfigStr: 'roles-config-str',
};

export const MIN_PLAYERS_COUNT = 6;


export const Constraints = {
  bothTeams: 'bothTeams',
  onlyOneTeam: 'onlyOneTeam',
  withRole: 'withRole',
};

export const REQUIRED_ROLES = {
  [MIN_PLAYERS_COUNT]: ['Президент', 'Бомбер'], // 2 total
  8: ['Медик'], // 4 total
  10: ['Горячая картошка'], // 5 total
  12: ['Агент'], // 7 total
  14: ['Посол'], // 9 total
}
export const OPTIONAL_ROLES = {
  [MIN_PLAYERS_COUNT]: [
    {role: 'Психолог', constraint: Constraints.withRole, withRole: 'Заговорщик'},
    {role: 'Заговорщик', constraint: Constraints.withRole, withRole: 'Психолог'},
    {role: 'Лжец'},
    {role: 'Купидон'},
    {role: 'Трейдер'},
  ],
  8: [
    {role: 'Дурак', constraint: Constraints.withRole, withRole: 'Заговорщик'},
    {role: 'Дилер', constraint: Constraints.withRole, withRole: 'Психолог'},
    {role: 'Гипнотизер'},
  ],
  10: [
    {role: 'Рожденный лидером', constraint: Constraints.bothTeams},
    {role: 'Фроттерист', constraint: Constraints.withRole, withRole: 'Мисс'},
    {role: 'Мисс', constraint: Constraints.withRole, withRole: 'Фроттерист'},
    {role: 'Оборотень', constraint: Constraints.bothTeams},
  ],
  12: [
    {role: 'Охотник', constraint: Constraints.bothTeams},
  ],
  14: [
    {role: 'Пристав', constraint: Constraints.bothTeams},
  ],
  18: [
    {role: 'Депутат'},
    {role: 'Мученик'},
  ]
};


export const ROLES = [
  {
    name: 'Президент',
    description: `Твоя цель - оказаться в разных комнатах с {Бомбером}(Бомбер) в конце игры. Это же - главная цель любого игрока синей команды`,
    team: Teams.blue,
    count: 1,
  },
  {
    name: 'Бомбер',
    description: `Твоя цель - оказаться в одной комнате с {Президентом}(Президент) в конце игры. Это же - главная цель любого игрока красной команды`,
    team: Teams.red,
    count: 1,
  },
  {
    name: 'Агент',
    description: `Один раз за раунд вы можете тайно раскрыть карту игроку и заставить этого игрока раскрыть свою карту вместе с вами. Нужно сказать целевому игроку: «Ты ДОЛЖЕН раскрыть свою карту мне». 
Если целевой игрок не может раскрыть свою карту в силу иных правил или эффектов, способность не срабатывает.`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Посол',
    description: `СРАЗУ ПОСЛЕ того, как карты персонажей были розданы, Послы должны публично объявить: «Я Посол!»
Послы НЕ должны раскрывать свой цвет ни при каких условиях. Могут свободно перемещаться между двумя комнатами. Послы никогда не могут участвовать в голосовании и не могут быть выбраны лидерами для перевода в другую комнату.
Посол дополнительно проигрывает, если в конце игры оказывается в комнате, где большинство персонажей другого цвета`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Лжец',
    description: `Должен отвечать ложью на любой заданный вопрос`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Горячая картошка',
    description: `При обоюдном открытии карт с любым другим человеком, вы меняетесь с ним картами и получаете все способности и цели новой карты.
В конце игры горячая картошка проигрывает - передай эту роль как можно скорее!`,
    team: Teams.grey,
    count: 1,
  },
  {
    name: 'Оборотень',
    description: `Ты играешь за противоположную цвету на этой карточке команду. Если ты красный - побеждаешь вместе с синими. Если синий - вместе с красными.
Ты ни при каких обстоятельствах не можешь раскрывать свою карту полностью и показывать роль. Только цвет.`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Заговорщик',
    description: `Любой игрок, приватно раскрывающий тебе карту, получает от тебя эффект запрета на показ своей карты при любых обстоятельствах в этом и следующем раундах. Этот эффект может быть снят с него только {Медиком}(Медик) и {Психологом}(Психолог).
Если на игроке до этого был эффект от {Дилера}(Дилер), и этот эффект, и новый отменяются.`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Купидон',
    description: `Один раз за игру ты можешь тайно раскрыть свою карточку двум игрокам. Расскажите им, что эти два игрока получают условие «влюбленные» и дополнительную цель победы. Они должны находиться в одной комнате в конце игры, иначе проиграют.
P.S. Если {Президент}(Президент) и {Бомбер}(Бомбер) становятся любовниками, лично {Президент}(Президент) не cможет выиграть :)`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Дилер',
    description: `Любой игрок, приватно раскрывающий тебе карту, в этом и следующем раунде не может отказаться от любого предложения совместного раскрытия карт. 
P.S. Если этот игрок встречается с {Заговорщиком}(Заговорщик), и этот эффект, и новый отменяются.`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Фроттерист',
    description: `Ты дополнительно проигрываешь, если НЕ коснешься КАЖДОГО игрока к концу игры.
Будь осторожнее! Если твое запястье схватит {Мисс}(Мисс), ты проиграешь!`,
    team: Teams.red,
    count: 1,
  },
  {
    name: 'Мисс',
    description: `Ты дополнительно проигрываешь, если НЕ схватишь запястье {Фроттериста}(Фроттерист) к концу игры. Ты можешь схватить только одно запястье за время всей игры. Если ты ошибаешься - ты тут же проигрываешь. 
Сразу после захвата раскрой цели свою карту. Если цель - {Фроттерист}(Фроттерист), он должен раскрыть карту в ответ`,
    team: Teams.blue,
    count: 1,
  },
  {
    name: 'Охотник',
    description: `Ты отбираешь карту у любого игрока, приватно полностью раскрывающего тебе карту, и просто забираешь в свою "копилку". Этот игрок теряет возможность показывать свою карту до конца игры (ведь показывать больше нечего), но сохраняет все её способности.
Охотника всего 2 и тот, у кого меньше карт к концу игры, дополнительно проигрывает`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Дурак',
    description: `Ты никогда не отказываешься от предложения обоюдно раскрыть карты целиком или частично.
У тебя есть защита на любой первый за раунд эффект от другого персонажа - он просто не срабатывает. Эффекты от второй и последующих встреч в раунде - срабатывают`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Депутат',
    description: `Ты выигрываешь только если оказываешься в одной комнате с  {Президентом}(Президент) в конце игры`,
    team: Teams.grey,
    count: 1,
  },
  {
    name: 'Мученик',
    description: `Ты выигрываешь только если оказываешься в одной комнате с {Бомбером}(Бомбер) в конце игры`,
    team: Teams.grey,
    count: 1,
  },
  {
    name: 'Трейдер',
    description: `Один раз за игру ты можешь приватно раскрыть свою карту двум игрокам. Скажи им, что эти два игрока ДОЛЖНЫ обменяться картами, не показывая их тебе. Они получают все способности и цели новых карт`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Медик',
    description: `Любой игрок, приватно раскрывающий тебе карту, излечивается от любых эффектов. Скажи ему, что если на нем были какие-то эффекты от встреч с другими персонажами, они больше не действуют.
P.S. С себя эффекты убирать нельзя, вы можете получить любые эффекты от других персонажей`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Рожденный лидером',
    description: `Один раз за игру, в любом раунде, КРОМЕ ПОСЛЕДНЕГО, ты можешь публично раскрыть свою карту и безоговорочно стать  новым лидером. Тебя нельзя свергнуть в этом раунде. 
Однако твоя карта должна оставаться публично раскрытой на протяжении всей игры.`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Психолог',
    description: `Когда ты приватно раскрываешь свою карту персонажу, который не может показывать свою карту из-за эффекта (например из-за эффекта {Заговорщика}(Заговорщик)), этот эффект отныне снимается и он может раскрывать свою карту. Если игрок говорит тебе, что не может раскрыть свою карту, ты говоришь, что ты психолог, и он может показывать карту, если его ограничивал эффект от другого персонажа`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Гипнотизер',
    description: `Любой игрок, приватно раскрывающий тебе карту, должен до конца игры соглашаться со всем, что ты говоришь. (Постарайтесь сдержать при нём все свои черные шутки :)`,
    team: Teams.both,
    count: 1,
  },
  {
    name: 'Пристав',
    description: `Один раз за игру ты можешь приватно раскрыть свою карту двум игрокам. Скажи им, что эти два игрока ДОЛЖНЫ полностью показать свои карты друг другу, не показывая их тебе`,
    team: Teams.both,
    count: 1,
  },
]

