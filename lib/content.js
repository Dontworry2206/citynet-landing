/**
 * CITYNET landing — single content source.
 * Edit this file to change copy, tariffs, coverage list or contacts —
 * no HTML/CSS edits needed. Structure follows CITYNET_ТЗ_лендинг_Meta_Google.docx.
 */
export const CITYNET_CONTENT = {
  defaultLanguage: "ru",
  languages: ["ru", "uz", "en"],

  contacts: {
    phone: "+998 71 202 11 11",
    phoneTel: "+998712021111",
    email: "info@citynet.uz",
    telegram: "https://t.me/citynet01",
    social: {
      instagram: "https://www.instagram.com/citynet.uzb/",
      telegram: "https://t.me/citynetit",
      facebook: "https://www.facebook.com/citynet.uzb/"
    },
    site: "https://citynet.uz",
    profileUrl: "https://citynet.uz/profile",
    aboutUrl: "https://citynet.uz/about",
    policyUrl: "https://citynet.uz/policy",
    offerUrl: "https://citynet.uz/assets/oferta.pdf",
    address: {
      ru: "Ташкент, Яшнабадский район, ул. Махтумкули, 98",
      uz: "Toshkent, Yashnobod tumani, Maxtumquli koʻchasi, 98",
      en: "Tashkent, Yashnabad district, Makhtumkuli St. 98"
    }
  },

  /* Real, currently sold home tariffs (BASIC is archived — excluded per brief) */
  tariffs: [
    { id: "smart", name: "SMART", speed: 50, price: 145000 },
    { id: "pro", name: "PRO", speed: 100, price: 175000, featured: true },
    { id: "max", name: "MAX", speed: 200, price: 225000 }
  ],

  /* Approved coverage registry — sourced from citynet.uz/coverage */
  coverage: [
    { district: { ru: "Алмазарский район", uz: "Almazar tumani", en: "Almazar district" },
      street: { ru: "Кичик халка йули", uz: "Kichik halqa yoʻli", en: "Kichik Halqa Yoli" },
      object: { ru: "Алмазар Сити", uz: "Almazar Siti", en: "Almazar City" },
      houses: "1B–28B, 1G–14G" },
    { district: { ru: "Мирабадский район", uz: "Mirobod tumani", en: "Mirobod district" },
      street: { ru: "Кушкуприк", uz: "Qoʻshkoʻprik", en: "Qoshkoprik" },
      object: { ru: "Альфраганус", uz: "Alfragonus", en: "Alfraganus" },
      houses: "20" },
    { district: { ru: "Мирзо-Улугбекский район", uz: "Mirzo-Ulugbek tumani", en: "Mirzo-Ulugbek district" },
      street: { ru: "Кува", uz: "Quva", en: "Quva" },
      object: { ru: "NRG", uz: "NRG", en: "NRG" },
      houses: "7" },
    { district: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", en: "Shaykhantakhur district" },
      street: { ru: "Ал-Хоразмий", uz: "Al-Xorazmiy", en: "Al-Khorazmiy" },
      object: { ru: "HUVAYDO Резиденция", uz: "HUVAYDO Rezidensiyasi", en: "HUVAYDO Residence" },
      houses: "60–66" },
    { district: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", en: "Shaykhantakhur district" },
      street: { ru: "Батыра Закирова", uz: "Botir Zokirov", en: "Botir Zokirov" },
      object: { ru: "Ташкент Сити", uz: "Toshkent Siti", en: "Tashkent City" },
      houses: "7" },
    { district: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", en: "Shaykhantakhur district" },
      street: { ru: "Фурката", uz: "Furqat", en: "Furqat" },
      object: { ru: "Ташкент Сити ЛОТ 7", uz: "Toshkent Siti LOT 7", en: "Tashkent City LOT 7" },
      houses: "1–7" },
    { district: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", en: "Shaykhantakhur district" },
      street: { ru: "Массив Бешагач", uz: "Beshogʻoch massivi", en: "Beshagach massif" },
      object: { ru: "NRG U-Tower", uz: "NRG U-Tower", en: "NRG U-Tower" },
      houses: "2" },
    { district: { ru: "Шайхантахурский район", uz: "Shayxontohur tumani", en: "Shaykhantakhur district" },
      street: { ru: "Батыра Закирова", uz: "Botir Zokirov", en: "Botir Zokirov" },
      object: { ru: "NEST ONE", uz: "NEST ONE", en: "NEST ONE" },
      houses: "1Б" },
    { district: { ru: "Сергелийский район", uz: "Sergeli tumani", en: "Sergeli district" },
      street: { ru: "Узар", uz: "Uzar", en: "Uzar" },
      object: { ru: "Чоштепа", uz: "Choshtepa", en: "Choshtepa" },
      houses: "47–85" },
    { district: { ru: "Сергелийский район", uz: "Sergeli tumani", en: "Sergeli district" },
      street: { ru: "Янги Сергели", uz: "Yangi Sergeli", en: "Yangi Sergeli" },
      object: { ru: "Сергели худуд 8-9", uz: "Sergeli hududi 8-9", en: "Sergeli zone 8-9" },
      houses: "17, 18, 27, 30, 31, 35–39, 54, 88" },
    { district: { ru: "Чиланзарский район", uz: "Chilonzor tumani", en: "Chilanzar district" },
      street: { ru: "Богистон", uz: "Bogʻiston", en: "Bogiston" },
      object: { ru: "Октепа Сохил Буйи", uz: "Oqtepa Sohil Boʻyi", en: "Oqtepa Sohil Boyi" },
      houses: "95–118" },
    { district: { ru: "Чиланзарский район", uz: "Chilonzor tumani", en: "Chilanzar district" },
      street: { ru: "Чилонзор", uz: "Chilonzor", en: "Chilanzar" },
      object: { ru: "NRG-Чилонзор", uz: "NRG-Chilonzor", en: "NRG-Chilanzar" },
      houses: "82А, 82В" },
    { district: { ru: "Бустанлык, Ташкентская область", uz: "Bostonliq tumani, Toshkent viloyati", en: "Bostanliq district, Tashkent region" },
      street: { ru: "МСГ Ходжикент", uz: "Xoʻjakent MSG", en: "Khojakent MSG" },
      object: { ru: "Чорвок Дарвоза", uz: "Chorvoq Darvoza", en: "Chorvoq Darvoza" },
      houses: "D и E блоки" }
  ],

  trustStats: [
    { value: "2019", ru: "год начала работы в Узбекистане", uz: "yildan Oʻzbekiston bozorida", en: "on the market in Uzbekistan since" },
    { value: "200+", ru: "реализованных проектов", uz: "amalga oshirilgan loyiha", en: "projects delivered" },
    { value: "24/7", ru: "поддержка клиентов", uz: "mijozlarni qoʻllab-quvvatlash", en: "customer support" }
  ],

  strings: {
    /* ================= RUSSIAN ================= */
    ru: {
      meta: {
        title: "Домашний интернет CITYNET — тарифы и подключение",
        description: "Интернет вашего дома от CITYNET. Тарифы от 145 000 сум/мес. Оставьте адрес — проверим возможность подключения."
      },
      skipToForm: "Перейти к заявке",
      header: {
        navTariffs: "Тарифы",
        navCoverage: "Покрытие",
        navHow: "Как подключиться",
        existingClient: "Уже наш клиент?",
        support: "Поддержка",
        cta: "Проверить подключение",
        themeToLight: "Светлая тема",
        themeToDark: "Тёмная тема"
      },
      hero: {
        overline: "Домашний интернет CITYNET",
        h1Line1: "Интернет для",
        h1Line2: "вашего дома и бизнеса",
        subtitle: "Для работы, учёбы и отдыха. Тарифы от 145 000 сум в месяц. Оставьте адрес — проверим возможность подключения.",
        cta: "Проверить подключение",
        secondary: "Посмотреть тарифы",
        note: "Подключение бесплатно при наличии технической возможности"
      },
      benefits: {
        title: "CITYNET рядом",
        subtitle: "Понятный выбор тарифа и подключение по вашему адресу",
        items: [
          { title: "Проверка вашего адреса", text: "Уточним техническую возможность подключения в вашем доме." },
          { title: "Три понятных тарифа", text: "Выберите скорость под работу, учёбу и домашние развлечения." },
          { title: "Бесплатное подключение", text: "При наличии технической возможности. Условия оборудования уточняются отдельно." },
          { title: "Согласуем следующий шаг", text: "После проверки адреса согласуем условия и время подключения." }
        ]
      },
      tariffs: {
        title: "Тарифы для дома",
        subtitle: "Выберите подходящую скорость. Возможность подключения проверим по адресу.",
        perMonth: "сум/мес",
        speedUnit: "Мбит/с",
        descriptions: {
          smart: "Для повседневных задач",
          pro: "Для работы и отдыха дома",
          max: "Для повышенной нагрузки"
        },
        cta: "Выбрать",
        footnote: "Скорость по Wi-Fi зависит от оборудования, планировки и условий использования. Условия подключения и оборудования уточним после проверки адреса."
      },
      coverage: {
        title: "CITYNET в вашем доме",
        subtitle: "Найдите свой район, улицу или ЖК — или укажите адрес вручную",
        allDistricts: "Все районы",
        filterDistrict: "Район",
        filterStreet: "Улица",
        colDistrict: "Район",
        colStreet: "Улица",
        colObject: "Объект",
        colHouses: "Дома",
        rowCta: "Подключить",
        statusFound: "CITYNET работает в этом доме. Оставьте заявку — проверим подключение вашей квартиры.",
        manualTitle: "Не нашли свой адрес?",
        manualText: "Укажите его вручную — мы уточним возможность подключения по вашему адресу.",
        manualCta: "Указать адрес вручную",
        noResults: "По этому фильтру пока ничего не найдено — уточните адрес вручную в форме заявки."
      },
      steps: {
        title: "Три шага до подключения",
        items: [
          { title: "Оставьте адрес и телефон", text: "Отправьте заявку через форму на сайте." },
          { title: "Дождитесь проверки", text: "Уточним техническую возможность подключения и условия." },
          { title: "Согласуйте подключение", text: "Выберем доступное время визита специалиста." }
        ]
      },
      faq: {
        title: "Частые вопросы",
        items: [
          { q: "Есть ли CITYNET в моём доме?", a: "Укажите адрес в форме или найдите его в списке покрытия. Мы проверим техническую возможность подключения — наличие дома в списке ещё не подтверждает подключение конкретной квартиры." },
          { q: "Сколько стоит подключение?", a: "Подключение бесплатно при наличии технической возможности. Условия оборудования и дополнительных работ уточним до согласования подключения." },
          { q: "Какой тариф выбрать?", a: "SMART — 50, PRO — 100, MAX — 200 Мбит/с. Оставьте заявку, и мы поможем подобрать тариф под ваши задачи." },
          { q: "Нужен ли новый роутер?", a: "Сообщите модель вашего роутера. Специалист уточнит совместимость и условия использования или приобретения оборудования." },
          { q: "Когда меня подключат?", a: "После проверки адреса согласуем доступное время. Точный срок зависит от технической возможности и графика работ." },
          { q: "Будет ли такая же скорость по Wi-Fi?", a: "Скорость по Wi-Fi зависит от роутера, устройства, расстояния и помех. Условия скорости по тарифу уточняются при подключении." }
        ]
      },
      finalCta: {
        title: "Подключим ваш дом",
        subtitle: "Оставьте номер и адрес — проверим возможность подключения CITYNET"
      },
      form: {
        nameLabel: "Имя",
        namePlaceholder: "Как вас зовут",
        phoneLabel: "Телефон",
        addressLabel: "Дом или ЖК и адрес",
        addressPlaceholder: "Начните вводить адрес или выберите из списка покрытия",
        tariffLabel: "Тариф",
        tariffHelp: "Помогите выбрать",
        consentPrefix: "Согласен(-на) на обработку персональных данных в соответствии с ",
        consentLink: "политикой обработки данных",
        submit: "Отправить заявку",
        sending: "Отправляем…",
        successTitle: "Заявка принята",
        successText: "Мы проверим возможность подключения по вашему адресу и свяжемся с вами.",
        errorText: "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
        belowNote: "Подключение бесплатно при наличии технической возможности.",
        errors: {
          name: "Укажите имя от 2 до 60 символов",
          phone: "Укажите номер из 9 цифр после +998",
          address: "Укажите дом, ЖК или улицу",
          consent: "Нужно согласие на обработку данных"
        }
      },
      footer: {
        colInternet: "Интернет",
        linkTariffs: "Тарифы",
        linkCoverage: "Покрытие",
        linkHow: "Как подключиться",
        linkProfile: "Личный кабинет",
        colCompany: "Компания",
        linkAbout: "О компании",
        linkBusiness: "Интернет для бизнеса",
        linkSupport: "Поддержка действующим клиентам",
        colDocs: "Документы",
        linkPolicy: "Политика обработки данных",
        linkOffer: "Оферта",
        supportLabel: "Служба поддержки",
        addressLabel: "Адрес",
        legal: "© 2026 CITYNET. Все права защищены.",
        disclaimer: "Информация на странице не является публичной офертой. Тарифы и условия подключения уточняются после проверки адреса."
      }
    },

    /* ================= UZBEK (Latin) ================= */
    uz: {
      meta: {
        title: "CITYNET uy interneti — tariflar va ulanish",
        description: "CITYNET — uyingizning interneti. Tariflar oyiga 145 000 soʻmdan. Manzilingizni qoldiring — ulanish imkoniyatini tekshiramiz."
      },
      skipToForm: "Arizaga oʻtish",
      header: {
        navTariffs: "Tariflar",
        navCoverage: "Qamrov hududi",
        navHow: "Qanday ulanish",
        existingClient: "Allaqachon mijozmisiz?",
        support: "Qoʻllab-quvvatlash",
        cta: "Ulanishni tekshirish",
        themeToLight: "Yorugʻ mavzu",
        themeToDark: "Tungi mavzu"
      },
      hero: {
        overline: "CITYNET uy interneti",
        h1Line1: "Uyingiz va biznesingiz",
        h1Line2: "uchun internet",
        subtitle: "Ish, taʼlim va dam olish uchun. Tariflar oyiga 145 000 soʻmdan boshlanadi. Manzilingizni qoldiring — ulanish imkoniyatini tekshiramiz.",
        cta: "Ulanishni tekshirish",
        secondary: "Tariflarni koʻrish",
        note: "Texnik imkoniyat mavjud boʻlsa, ulanish bepul"
      },
      benefits: {
        title: "CITYNET yaqiningizda",
        subtitle: "Tarifni tanlash va manzilingiz boʻyicha ulanish — qulay va tushunarli",
        items: [
          { title: "Manzilingizni tekshiramiz", text: "Uyingizda ulanish uchun texnik imkoniyatni aniqlaymiz." },
          { title: "Uch aniq tarif", text: "Ish, taʼlim va uydagi koʻngilochar tadbirlar uchun tezlikni tanlang." },
          { title: "Bepul ulanish", text: "Texnik imkoniyat mavjud boʻlsa. Uskuna shartlari alohida aniqlashtiriladi." },
          { title: "Keyingi qadamni kelishamiz", text: "Manzil tekshirilgach, ulanish shartlari va vaqtini kelishamiz." }
        ]
      },
      tariffs: {
        title: "Uy uchun tariflar",
        subtitle: "Mos tezlikni tanlang. Ulanish imkoniyatini manzil boʻyicha tekshiramiz.",
        perMonth: "soʻm/oy",
        speedUnit: "Mbit/s",
        descriptions: {
          smart: "Kundalik vazifalar uchun",
          pro: "Ish va uydagi dam olish uchun",
          max: "Yuqori yuklama uchun"
        },
        cta: "Tanlash",
        footnote: "Wi-Fi orqali tezlik uskunaga, uy tuzilishiga va foydalanish shartlariga bogʻliq. Ulanish va uskuna shartlarini manzil tekshirilgandan keyin aniqlashtiramiz."
      },
      coverage: {
        title: "CITYNET uyingizda",
        subtitle: "Tumaningizni, koʻchangizni yoki turar-joy majmuasini toping — yoki manzilni qoʻlda kiriting",
        allDistricts: "Barcha tumanlar",
        filterDistrict: "Tuman",
        filterStreet: "Koʻcha",
        colDistrict: "Tuman",
        colStreet: "Koʻcha",
        colObject: "Obyekt",
        colHouses: "Uylar",
        rowCta: "Ulash",
        statusFound: "Bu uyda CITYNET ishlaydi. Arizangizni qoldiring — xonadoningizga ulanish imkoniyatini tekshiramiz.",
        manualTitle: "Manzilingizni topolmadingizmi?",
        manualText: "Uni qoʻlda kiriting — biz manzilingiz boʻyicha ulanish imkoniyatini aniqlaymiz.",
        manualCta: "Manzilni qoʻlda kiritish",
        noResults: "Bu filtr boʻyicha hozircha hech narsa topilmadi — ariza formasida manzilni qoʻlda koʻrsating."
      },
      steps: {
        title: "Ulanishgacha uch qadam",
        items: [
          { title: "Manzil va telefon qoldiring", text: "Saytdagi forma orqali ariza yuboring." },
          { title: "Tekshirishni kuting", text: "Texnik imkoniyat va shartlarni aniqlaymiz." },
          { title: "Ulanishni kelishing", text: "Mutaxassis tashrifi uchun qulay vaqtni tanlaymiz." }
        ]
      },
      faq: {
        title: "Tez-tez beriladigan savollar",
        items: [
          { q: "Uyimda CITYNET bormi?", a: "Formada manzilni koʻrsating yoki qamrov roʻyxatidan toping. Texnik imkoniyatni tekshiramiz — uyning roʻyxatda boʻlishi xonadoningizga ulanishni tasdiqlamaydi." },
          { q: "Ulanish qancha turadi?", a: "Texnik imkoniyat mavjud boʻlsa, ulanish bepul. Uskuna va qoʻshimcha ishlar shartlarini kelishishdan oldin aniqlashtiramiz." },
          { q: "Qaysi tarifni tanlash kerak?", a: "SMART — 50, PRO — 100, MAX — 200 Mbit/s. Ariza qoldiring — vazifalaringizga mos tarifni tanlashda yordam beramiz." },
          { q: "Yangi router kerakmi?", a: "Routeringiz modelini xabar qiling. Mutaxassis moslikni va uskunadan foydalanish yoki uni sotib olish shartlarini aniqlashtiradi." },
          { q: "Qachon ulanaman?", a: "Manzil tekshirilgach, qulay vaqtni kelishamiz. Aniq muddat texnik imkoniyat va ishlar jadvaliga bogʻliq." },
          { q: "Wi-Fi orqali xuddi shu tezlik boʻladimi?", a: "Wi-Fi tezligi router, qurilma, masofa va toʻsiqlarga bogʻliq. Tarif tezligi shartlari ulanish vaqtida aniqlashtiriladi." }
        ]
      },
      finalCta: {
        title: "Uyingizni ulaymiz",
        subtitle: "Raqam va manzilingizni qoldiring — CITYNET ulanish imkoniyatini tekshiramiz"
      },
      form: {
        nameLabel: "Ism",
        namePlaceholder: "Ismingiz",
        phoneLabel: "Telefon",
        addressLabel: "Uy yoki turar-joy majmuasi va manzil",
        addressPlaceholder: "Manzilni kiriting yoki qamrov roʻyxatidan tanlang",
        tariffLabel: "Tarif",
        tariffHelp: "Tanlashda yordam bering",
        consentPrefix: "Maʼlumotlarni qayta ishlash ",
        consentLink: "siyosatiga muvofiq shaxsiy maʼlumotlarimni qayta ishlashga roziman",
        submit: "Ariza yuborish",
        sending: "Yuborilmoqda…",
        successTitle: "Ariza qabul qilindi",
        successText: "Manzilingiz boʻyicha ulanish imkoniyatini tekshiramiz va sizga bogʻlanamiz.",
        errorText: "Arizani yuborib boʻlmadi. Qayta urinib koʻring yoki bizga qoʻngʻiroq qiling.",
        belowNote: "Texnik imkoniyat mavjud boʻlsa, ulanish bepul.",
        errors: {
          name: "Ismni 2–60 belgi oraligʻida kiriting",
          phone: "+998 dan keyin 9 xonali raqam kiriting",
          address: "Uy, turar-joy majmuasi yoki koʻchani koʻrsating",
          consent: "Maʼlumotlarni qayta ishlashga rozilik kerak"
        }
      },
      footer: {
        colInternet: "Internet",
        linkTariffs: "Tariflar",
        linkCoverage: "Qamrov hududi",
        linkHow: "Qanday ulanish",
        linkProfile: "Shaxsiy kabinet",
        colCompany: "Kompaniya",
        linkAbout: "Kompaniya haqida",
        linkBusiness: "Biznes uchun internet",
        linkSupport: "Mavjud mijozlar uchun qoʻllab-quvvatlash",
        colDocs: "Hujjatlar",
        linkPolicy: "Maʼlumotlarni qayta ishlash siyosati",
        linkOffer: "Ommaviy taklif",
        supportLabel: "Qoʻllab-quvvatlash xizmati",
        addressLabel: "Manzil",
        legal: "© 2026 CITYNET. Barcha huquqlar himoyalangan.",
        disclaimer: "Sahifadagi maʼlumot ommaviy taklif hisoblanmaydi. Tarif va ulanish shartlari manzil tekshirilgandan keyin aniqlashtiriladi."
      }
    },

    /* ================= ENGLISH ================= */
    en: {
      meta: {
        title: "CITYNET home internet — plans & connection",
        description: "CITYNET — internet for your home. Plans from 145,000 UZS/month. Leave your address — we'll check if we can connect you."
      },
      skipToForm: "Skip to request form",
      header: {
        navTariffs: "Plans",
        navCoverage: "Coverage",
        navHow: "How it works",
        existingClient: "Already a customer?",
        support: "Support",
        cta: "Check availability",
        themeToLight: "Light theme",
        themeToDark: "Dark theme"
      },
      hero: {
        overline: "CITYNET home internet",
        h1Line1: "Internet for your",
        h1Line2: "home and business",
        subtitle: "For work, study and downtime. Plans from 145,000 UZS a month. Leave your address — we'll check if we can connect you.",
        cta: "Check availability",
        secondary: "View plans",
        note: "Connection is free where technically possible"
      },
      benefits: {
        title: "CITYNET near you",
        subtitle: "A clear plan to choose, and a connection at your own address",
        items: [
          { title: "We check your address", text: "We confirm the technical possibility of connecting your building." },
          { title: "Three clear plans", text: "Pick a speed for work, study and home entertainment." },
          { title: "Free connection", text: "Where technically possible. Equipment terms are confirmed separately." },
          { title: "We agree on the next step", text: "After checking your address, we confirm the terms and timing." }
        ]
      },
      tariffs: {
        title: "Home plans",
        subtitle: "Choose the right speed. We'll confirm availability at your address.",
        perMonth: "UZS/mo",
        speedUnit: "Mbps",
        descriptions: {
          smart: "For everyday tasks",
          pro: "For work and downtime at home",
          max: "For heavier loads"
        },
        cta: "Choose",
        footnote: "Wi-Fi speed depends on your equipment, layout and usage conditions. Connection and equipment terms are confirmed after checking your address."
      },
      coverage: {
        title: "CITYNET in your building",
        subtitle: "Find your district, street or complex — or enter your address manually",
        allDistricts: "All districts",
        filterDistrict: "District",
        filterStreet: "Street",
        colDistrict: "District",
        colStreet: "Street",
        colObject: "Complex",
        colHouses: "Buildings",
        rowCta: "Connect",
        statusFound: "CITYNET is available in this building. Leave a request — we'll check the connection for your apartment.",
        manualTitle: "Can't find your address?",
        manualText: "Enter it manually — we'll check the connection possibility at your address.",
        manualCta: "Enter address manually",
        noResults: "Nothing matches this filter yet — enter your address manually in the request form."
      },
      steps: {
        title: "Three steps to get connected",
        items: [
          { title: "Leave your address and phone", text: "Submit a request through the form." },
          { title: "Wait for the check", text: "We confirm technical availability and terms." },
          { title: "Agree on connection", text: "We schedule a convenient time for the visit." }
        ]
      },
      faq: {
        title: "Frequently asked questions",
        items: [
          { q: "Is CITYNET available at my address?", a: "Enter your address in the form or find it in the coverage list. We'll check technical availability — being listed doesn't yet confirm connection for a specific apartment." },
          { q: "How much does connection cost?", a: "Connection is free where technically possible. Equipment and any extra work are confirmed before we schedule the connection." },
          { q: "Which plan should I choose?", a: "SMART — 50, PRO — 100, MAX — 200 Mbps. Leave a request and we'll help you pick the right plan." },
          { q: "Do I need a new router?", a: "Tell us your router model. Our specialist will confirm compatibility and the terms for using or purchasing equipment." },
          { q: "When will I be connected?", a: "After checking your address we'll agree on a convenient time. The exact date depends on technical availability and scheduling." },
          { q: "Will Wi-Fi speed be the same?", a: "Wi-Fi speed depends on the router, device, distance and interference. Plan speed terms are confirmed at connection." }
        ]
      },
      finalCta: {
        title: "Let's connect your home",
        subtitle: "Leave your number and address — we'll check CITYNET availability"
      },
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        phoneLabel: "Phone",
        addressLabel: "Building or complex and address",
        addressPlaceholder: "Start typing your address or pick from the coverage list",
        tariffLabel: "Plan",
        tariffHelp: "Help me choose",
        consentPrefix: "I agree to the processing of my personal data under the ",
        consentLink: "data processing policy",
        submit: "Send request",
        sending: "Sending…",
        successTitle: "Request received",
        successText: "We'll check the connection possibility at your address and get in touch.",
        errorText: "Couldn't send the request. Try again or call us.",
        belowNote: "Connection is free where technically possible.",
        errors: {
          name: "Enter a name between 2 and 60 characters",
          phone: "Enter 9 digits after +998",
          address: "Enter a building, complex or street",
          consent: "Consent to data processing is required"
        }
      },
      footer: {
        colInternet: "Internet",
        linkTariffs: "Plans",
        linkCoverage: "Coverage",
        linkHow: "How it works",
        linkProfile: "Account",
        colCompany: "Company",
        linkAbout: "About",
        linkBusiness: "Internet for business",
        linkSupport: "Support for existing customers",
        colDocs: "Documents",
        linkPolicy: "Data processing policy",
        linkOffer: "Public offer",
        supportLabel: "Support",
        addressLabel: "Address",
        legal: "© 2026 CITYNET. All rights reserved.",
        disclaimer: "Information on this page is not a public offer. Plans and connection terms are confirmed after checking your address."
      }
    }
  }
};

export default CITYNET_CONTENT;
