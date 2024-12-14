window.Teams = {
  red: 'red',
  blue: 'blue',
  grey: 'grey',
  both: 'both',
}

window.Pages = {
  roles: [
    {
      name: 'Джейми',
      description: `Твоя цель, как и всей Белой команды - оказаться в разных комнатах с {Кромешником}(Кромешник) в конце игры. Это же - главная цель любого белого игрока`,
      team: Teams.blue,
      count: 1,
    },
    {
      name: 'Кромешник',
      description: `Твоя цель, как и всей Чёрной команды - оказаться в одной комнате с {Джейми}(Джейми) в конце игры. Это же - главная цель любого Чёрного игрока`,
      team: Teams.red,
      count: 1,
    },
    {
      name: 'Луноликий',
      description: `Один раз за раунд вы можете тайно раскрыть карту игроку и заставить этого игрока раскрыть свою карту вместе с вами. Нужно сказать целевому игроку: «Ты ДОЛЖЕН раскрыть свою карту мне». 
Если целевой игрок не может раскрыть свою карту в силу иных правил или эффектов, способность не срабатывает.`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Призрак',
      description: `СРАЗУ ПОСЛЕ того, как карты персонажей были розданы, Призрак должен публично объявить: «Я Призрак!»
Призрак НЕ должен раскрывать свой цвет. Призраки могут свободно перемещаться между двумя комнатами. Призрак никогда не могут участвовать в голосовании и не могут быть выбраны Лидерами для перевода в другую комнату.
Призрак дополнительно проигрывает, если в конце игры оказывается в комнате, где большинство персонажей другого цвета`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Ребёнок-врунишка',
      description: `Должен отвечать ложью на любой заданный вопрос`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Перевёртыш',
      description: `При обоюдном открытии карт с любым другим человеком, вы меняетесь с ним картами и получаете все способности и цели новой карты.
В конце игры Перевёртыш проигрывает - передай эту роль как можно скорее!`,
      team: Teams.grey,
      count: 1,
    },
    {
      name: 'Оборотень',
      description: `Ты играешь за противоположную цвету на этой карточке команду. Если ты Чёрный - побеждаешь вместе с белыми. Если белый - вместе с Чёрными.
Ты ни при каких обстоятельствах не можешь раскрывать свою карту полностью и показывать роль. Только цвет.`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Владыка тайн',
      description: `Любой игрок, приватно раскрывающий тебе карту, получает от тебя эффект запрета на показ своей карты при любых обстоятельствах в этом и следующем раундах. Этот эффект может быть снят с него только {Целителем снов}(Целитель снов) и {Разрушителем иллюзий}(Разрушитель иллюзий).
Если на игроке до этого был эффект от {Джинна}(Джинн), и этот эффект, и новый отменяются.`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Тёмный купидон',
      description: `Один раз за игру ты можешь тайно раскрыть свою карточку двум игрокам. Расскажите им, что эти два игрока получают условие «влюбленные» и дополнительную цель победы. Они должны находиться в одной комнате в конце игры, иначе проиграют.
P.S. Если {Джейми}(Джейми) и {Кромешник}(Кромешник) становятся любовниками, лично {Джейми}(Джейми) не cможет выиграть :)`,
      team: Teams.red,
      count: 1,
    },
    {
      name: 'Джинн',
      description: `Любой игрок, приватно раскрывающий тебе карту, в этом и следующем раунде не может отказаться от любого предложения совместного раскрытия карт. 
P.S. Если этот игрок встречается с {Владыкой тайн}(Владыка тайн), и этот эффект, и новый отменяются.`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Всадник кошмара',
      description: `Ты дополнительно проигрываешь, если НЕ коснешься КАЖДОГО игрока к концу игры.
Будь осторожнее! Если твое запястье схватит {Зубная фея}(Зубная фея), ты проиграешь!`,
      team: Teams.red,
      count: 1,
    },
    {
      name: 'Зубная фея',
      description: `Ты дополнительно проигрываешь, если НЕ схватишь запястье {Всадника кошмара}(Всадник кошмара) к концу игры. Ты можешь схватить только одно запястье за время всей игры. Если ты ошибаешься - ты тут же проигрываешь. 
Сразу после захвата раскрой цели свою карту. Если цель - {Всадник кошмара}(Всадник кошмара), он должен раскрыть карту в ответ`,
      team: Teams.blue,
      count: 1,
    },
    {
      name: 'Пасхальный кролик',
      description: `Ты отбираешь карту у любого игрока, приватно полностью раскрывающего тебе карту, и просто забираешь в свою "копилку". Этот игрок теряет возможность показывать свою карту до конца игры (ведь показывать больше нечего), но сохраняет все её способности.
Охотника всего 2, тот у кого меньше карт к концу игры проигрывает`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Песочник',
      description: `Ты никогда не отказываешься от предложения обоюдно раскрыть карты целиком или частично.
У тебя есть защита на любой первый за раунд эффект от другого персонажа - он просто не срабатывает. Эффекты от второй и последующих встреч в раунде - срабатывают`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Ледяной Джек',
      description: `Ты выигрываешь только если оказываешься в одной комнате с  {Джейми}(Джейми) в конце игры`,
      team: Teams.grey,
      count: 1,
    },
    {
      name: 'Непослушный ребёнок',
      description: `Ты выигрываешь только если оказываешься в одной комнате с {Кромешником}(Кромешник) в конце игры`,
      team: Teams.grey,
      count: 1,
    },
    {
      name: 'Ткач судеб',
      description: `Один раз за игру ты можешь приватно раскрыть свою карту двум игрокам. Скажи им, что эти два игрока ДОЛЖНЫ обменяться картами. Они получают все способности и цели новых карт`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Целитель снов',
      description: `Любой игрок, приватно раскрывающий тебе карту, излечивается от любых эффектов. Скажи ему, что если на нем были какие-то эффекты от встреч с другими персонажами, они больше не действуют.
P.S. С себя эффекты убирать нельзя, вы можете получить любые эффекты от других персонажей`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Санта',
      description: `Один раз за игру, в любом раунде, КРОМЕ ПОСЛЕДНЕГО, ты можешь публично раскрыть свою карту и безоговорочно стать новым лидером. Тебя нельзя свергнуть в этом раунде. 
Однако твоя карта должна оставаться публично раскрытой на протяжении всей игры.`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Разрушитель иллюзий',
      description: `Когда ты приватно раскрываешь свою карту персонажу, который не может показывать свою карту из-за эффекта (например из-за эффекта {Заговорщика}(Заговорщик)), этот эффект отныне снимается и он может раскрывать свою карту. Если игрок говорит тебе, что не может раскрыть свою карту, ты говоришь, что ты психолог, и он может показывать карту, если его ограничивал эффект от другого персонажа`,
      team: Teams.both,
      count: 1,
    },
    {
      name: 'Шепчущий дух',
      description: `Любой игрок, приватно раскрывающий тебе карту, должен до конца игры соглашаться со всем, что ты говоришь. (Постарайтесь сдержать при нём все свои черные шутки :)`,
      team: Teams.both,
      count: 1,
    },
  ]
}
