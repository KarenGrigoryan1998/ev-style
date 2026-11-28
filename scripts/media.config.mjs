/**
 * Where the photos and videos come from.
 *
 * SOURCE   = your EVStyle folder (override: EVSTYLE_SRC=/path npm run import-media)
 * PRODUCTS = product id (same as "id" in src/data/products.json) → photos, first photo = main card photo.
 *   { folder: 'Tail Lights' }                      → every photo in products/Tail Lights, A→Z
 *   { folder: 'Tail Lights', photos: ['b.jpg', 'a.jpg'] } → only these, in this order
 *   { photos: ['Folder/a.jpg', '../top-level.jpg'] }   → paths relative to products/
 *   { photos: [{ file: 'wide-screenshot.png', pad: true }] } → pad to a square instead of
 *     center-cropping (for a wide/landscape photo where cropping would cut off the subject)
 *
 * After editing, run:  npm run import-media   (converts to WebP and fills "images" in products.json)
 */
import os from 'node:os'
import path from 'node:path'

export const SOURCE = process.env.EVSTYLE_SRC || path.join(os.homedir(), 'Documents', 'EVStyle')

export const PRODUCTS = {
  'glowing-logo': {
    folder: 'Light Emblem',
    photos: [
      'openart-image_1792704224883_c8c554bb_1792704225860_0c4d2cc9.jpg',
      'openart-image_1792703797343_b782a95c_1792703798871_be707813.jpg',
      'IMG_4523.jpg',
      'openart-image_1792704568737_a2dedecd_1792704569151_47919fa0.jpg',
      'IMG_4525.jpg',
    ],
  },
  'radiator-net': {
    folder: 'Radiator Mesh',
    photos: [
      '3.jpg',
      '2.jpg',
      '1.jpg',
      'O1CN01qPCr2G27WkRang75z_!!2645537805-0-cib (1).jpg',
    ],
  },
  'silicone-set': {
    photos: [
      'Silicone Set/S07/openart-image_1795118332908_dc5fae9c_1795118333347_12dc4315.jpg',
      'Silicone Set/S07/openart-image_1795258371920_1a884fa5_1795258372256_fef15400.jpg',
      'Silicone Set/S07/openart-image_1795118016142_278dca09_1795118016592_391c61ba.jpg',
      'Silicone Set/S05/openart-image_1795117846654_d845fd84_1795117847064_716e7cd9.jpg',
      'Silicone Set/S05/openart-image_1795117780137_d7289de7_1795117780589_970f8e6b (1).jpg',
      'Silicone Set/SL03/openart-image_1795712655925_8e7c1833_1795712656287_9088330c.jpg',
      'Silicone Set/SL03/openart-image_1795712703915_a92141c2_1795712704224_6e179e28.jpg',
    ],
  },
  'anti-kick-pad': {
    folder: 'Anti-Kick Pad ',
    photos: [
      'openart-image_1795711661651_3bd7d5b3_1795711661982_a57bb444.jpg',
      'openart-image_1795711900064_c829832d_1795711900584_f18453ea.jpg',
      'openart-image_1795711721894_57219db9_1795711722368_612b06f7.jpg',
      'openart-image_1795711983539_810a1773_1795711983841_d40b044d.jpg',
      'openart-image_1795712203289_d6a1f5e0_1795712203999_cf0d55e5.jpg',
    ],
  },
  'fridge-silicone-pad': {
    folder: 'Refrigerator cup holder silicone',
    photos: [
      'openart-image_1795712476299_5a500cc7_1795712477218_a0953af6.jpg',
      'openart-image_1795712371748_b10af3f5_1795712372104_35398340.jpg',
      'openart-image_1795712548441_10fa816a_1795712549274_047fa7b5.jpg',
    ],
  },
  'deepal-letter': {
    folder: 'Deepal Letter',
    photos: [{ file: 'Screenshot 2026-11-28 at 16.46.44.png', pad: true }],
  },
  'window-button-covers': {
    folder: 'Silicon set window btns',
    photos: [
      'openart-image_1795713483193_f8c92e7d_1795713483394_141d34dd.jpg',
      'openart-image_1795713362576_1645f048_1795713362731_898eb6b6.jpg',
      'openart-image_1795713434593_aecc5d98_1795713435226_00583a4c.jpg',
      'openart-image_1795713137398_038d0335_1795713138191_f0f1bd3b.jpg',
    ],
  },
  'seat-covers': {
    folder: 'Seat Covers/3. alcantara aranc mejq',
    photos: [
      'main.jpg',
      'openart-image_1791970298288_95aba3a8_1791970299540_deca1227.jpg',
      'openart-image_1793821879904_7976018d_1793821880864_41d58c02.jpg',
      'openart-image_1791970657849_1656b7a2_1791970658099_c05095e4.jpg',
    ],
  },
  'seat-cushions': {
    folder: 'Headrest Pillows',
    photos: [
      'openart-image_1792514772906_d100276c_1792514773906_72ce0ab7.jpg',
      'openart-image_1792514943590_eea42b53_1792514944222_76b8ae66.jpg',
      'openart-image_1793820548544_31a94453_1793820549557_f9ab434f.jpg',
      'openart-image_1792515562518_5ab19ff1_1792515562663_92dc415a.jpg',
      'openart-image_1792514560668_95753a2b_1792514561650_900cf9f3.jpg',
    ],
  },
  pedals: {
    folder: 'Pedal Pads',
    photos: [
      'openart-image_1792518262792_83ba2989_1792518263312_f78782ac.jpg',
      'openart-image_1792518200389_9aa89e4e_1792518201091_b58e5c42.jpg',
      'openart-image_1792518435929_7ee5dbc5_1792518437104_a77a293b.jpg',
      'openart-image_1792518359783_05b084f6_1792518360118_c0bd41ba (1).jpg',
    ],
  },
  'tissue-box': {
    folder: 'Tissue Box',
    photos: [
      'openart-image_1792518647426_bdb6e180_1792518648294_4ac9389c (1).jpg',
      'openart-image_1792518701579_f7fde0bb_1792518702249_d21a074c.jpg',
      'openart-image_1792518826509_24307437_1792518826892_703ceabe.jpg',
    ],
  },
  'trunk-cover': {
    folder: 'Trunk Cover',
    photos: [
      'openart-image_1792173477903_bb7c19ac_1792173478703_0991a357.jpg',
      'O1CN01H6LAlm1t8YqJXWOYp_!!2217487335857-0-cib (1).jpg',
      'Hfbd61bc26d2a4beea3a38751a0f6f3b1Q.jpg',
      'O1CN01dOa4if1t8YqHx0slL_!!2217487335857-0-cib.jpg',
    ],
  },
  'steering-cover': {
    folder: 'Steering Wheel Cover',
    photos: [
      'O1CN013CcyCQ1CnIcolVqZM_!!2217254080125-0-cib.jpg',
      'O1CN01eWoQjg1CnIcplx09p_!!2217254080125-0-cib.jpg',
      'O1CN01rdnjbM1CnIcpWoHt5_!!2217254080125-0-cib.jpg',
    ],
  },
  'glasses-holder': {
    folder: 'Glasses Holder',
    photos: [
      'openart-image_1795257231221_7784db3a_1795257231708_d8927dfc.jpg',
      'openart-image_1795257104028_8f3fadb9_1795257105169_7d9c06a4.jpg',
    ],
  },
  'wiper-blades': {
    folder: 'Windshield Wiper',
    photos: [
      'openart-image_1795258601157_78e4cb74_1795258601734_51b078ed.jpg',
      'openart-image_1795258672453_6e0e703f_1795258672891_92987c98.jpg',
    ],
  },
  'cabin-filter': {
    folder: 'Cabin Filter',
    photos: [
      'openart-image_1795256804200_b6671ee8_1795256804470_cd7790d2 (1).jpg',
      'openart-image_1795256901959_00f13dc6_1795256902504_fda5b069.jpg',
    ],
  },
  'leather-seat-set': {
    folder: 'Seat Covers/1. S0507 kashi full set',
    photos: [
      'openart-image_1791965816596_30b56335_1791965817362_44573a91.jpg',
      'openart-image_1791972524174_0a2c3542_1791972525117_60338561.jpg',
      'main.jpg',
      'openart-image_1791966014726_428ed98e_1791966015411_af4b2cff.jpg',
    ],
  },
  'soft-seat-set': {
    folder: 'Seat Covers/2. Soft Sl03S05S07 full set',
    photos: [
      'openart-image_1791967157355_2c63d7cd_1791967158234_61280ab5.jpg',
      'main.jpg',
      'openart-image_1791967218721_46c77887_1791967219740_ee207bf7.jpg',
      'openart-image_1791967297080_36d5b7f1_1791967298052_7ee64c37.jpg',
    ],
  },
  'leg-rest-set': {
    folder: 'Seat Covers/6. Leg support chexol',
    photos: [
      'openart-image_1792172259151_36a75c1b_1792172260168_b43252d0.jpg',
      'openart-image_1792172387869_770da43b_1792172388804_f247ca22.jpg',
      'openart-image_1792172484047_180287de_1792172484908_aed59437.jpg',
      'openart-image_1792172335491_c1160818_1792172336367_52c633a7.jpg',
    ],
  },
}

/** Gallery photos on the home page (paths relative to products/) — 4 photos fit the layout */
export const GALLERY = [
  'Seat Covers/1. S0507 kashi full set/openart-image_1791972524174_0a2c3542_1791972525117_60338561.jpg',
  'Seat Covers/6. Leg support chexol/openart-image_1792172259151_36a75c1b_1792172260168_b43252d0.jpg',
  'Headrest Pillows/openart-image_1793820548544_31a94453_1793820549557_f9ab434f.jpg',
  'Seat Covers/2. Soft Sl03S05S07 full set/openart-image_1791967157355_2c63d7cd_1791967158234_61280ab5.jpg',
]

/** Hero poster (relative to products/) */
export const HERO_POSTER = 'Light Emblem/openart-image_1792703797343_b782a95c_1792703798871_be707813.jpg'

/** Logo source (relative to SOURCE) — the flat background is removed automatically */
export const LOGO = 'main-2.jpg'

/** Videos: destination in /public → source (relative to SOURCE) */
export const VIDEOS = {
  'videos/hero.mp4': 'deepal_logo_glow_12s.mp4',
  'videos/gallery/follow.mp4': 'evstyle_follow_16s.mp4',
  'videos/gallery/logo-glow.mp4': 'products/Light Emblem/kijaki-h264-hd.mp4',
}
