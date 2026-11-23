import type { Schema, Struct } from '@strapi/strapi'

export interface ComponentesCarruselDeBanner extends Struct.ComponentSchema {
  collectionName: 'components_componentes_carrusel_de_banners'
  info: {
    description: 'Slide del banner. Alt viene de Imagen.alternativeText en Media Library. Orden = drag-and-drop.'
    displayName: 'Carrusel de Banner'
    icon: 'slideshow'
  }
  attributes: {
    Enlace: Schema.Attribute.Component<'componentes.enlace', false>
    Imagen: Schema.Attribute.Media<'images'> & Schema.Attribute.Required
  }
}

export interface ComponentesEnlace extends Struct.ComponentSchema {
  collectionName: 'components_componentes_enlaces'
  info: {
    description: 'URL del slide y si debe abrirse en una pesta\u00F1a nueva'
    displayName: 'Enlace'
    icon: 'link'
  }
  attributes: {
    AbrirEnNuevaPestana: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    Url: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface ComponentesMarca extends Struct.ComponentSchema {
  collectionName: 'components_componentes_marcas'
  info: {
    description: 'Imagotipo/isologo (logo + texto) e isotipo (s\u00EDmbolo)'
    displayName: 'Marca'
    icon: 'crown'
  }
  attributes: {
    Imagotipo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required
    Isotipo: Schema.Attribute.Media<'images'>
  }
}

export interface ComponentesMetadatos extends Struct.ComponentSchema {
  collectionName: 'components_componentes_metadatos'
  info: {
    description: 'T\u00EDtulos y descripci\u00F3n para SEO y metadatos (og, twitter, document title)'
    displayName: 'Metadatos'
    icon: 'search'
  }
  attributes: {
    Descripcion: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
        minLength: 50
      }>
    TituloCorto: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40
        minLength: 3
      }>
    TituloLargo: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70
        minLength: 10
      }>
  }
}

export interface JoyeriaDimensiones extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_dimensiones'
  info: {
    displayName: 'Dimensiones y Confecci\u00F3n'
    icon: 'ruler'
  }
  attributes: {
    DiametroMm: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    GrosorCalibreMm: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    LargoCm: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    TallaAnillo: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 14
          min: 3
        },
        number
      >
    TipoBroche: Schema.Attribute.Enumeration<
      [
        'reasa',
        'mosqueton',
        'pico_loro',
        'caja_seguridad',
        'rosca_topo',
        'mariposa',
        'clip_candonga',
        'sin_broche',
      ]
    >
    TipoTejido: Schema.Attribute.Enumeration<
      [
        'cordon',
        'figaro',
        'cartier',
        'veneciana',
        'lomo_corvina',
        'forzada',
        'singapur',
        'rolo',
        'gucci',
        'otro',
      ]
    >
  }
}

export interface JoyeriaFotoProducto extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_foto_productos'
  info: {
    description: 'Imagen o video con rol. Alt viene de Imagen.alternativeText en Media Library.'
    displayName: 'Foto de Producto / Lookbook'
    icon: 'picture'
  }
  attributes: {
    Imagen: Schema.Attribute.Media<'images' | 'videos'> & Schema.Attribute.Required
    ProductosEnFoto: Schema.Attribute.Relation<'oneToMany', 'api::producto.producto'>
    Rol: Schema.Attribute.Enumeration<
      ['galeria', 'modelo_puesto', 'detalle_macro', 'empaque', 'video_360', 'video_reels']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'galeria'>
  }
}

export interface JoyeriaGema extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_gemas'
  info: {
    displayName: 'Gema / Piedra Preciosa'
    icon: 'diamond'
  }
  attributes: {
    Cantidad: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>
    Certificado: Schema.Attribute.Enumeration<['igi', 'gia', 'certificado_joyeria', 'ninguno']> &
      Schema.Attribute.DefaultTo<'ninguno'>
    Claridad: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30
      }>
    ColorGema: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30
      }>
    Corte: Schema.Attribute.Enumeration<
      [
        'brillante_redondo',
        'corte_esmeralda',
        'princesa',
        'oval',
        'gota_pera',
        'marquise',
        'baguette',
        'cushion',
      ]
    >
    QuilatesCt: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    TipoGema: Schema.Attribute.Enumeration<
      [
        'diamante_natural',
        'diamante_laboratorio',
        'esmeralda',
        'zafiro',
        'rubi',
        'circonia',
        'perla',
        'moissanita',
      ]
    > &
      Schema.Attribute.Required
  }
}

export interface JoyeriaMedidas extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_medidas'
  info: {
    displayName: 'Medida'
  }
  attributes: {
    DiametroMm: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    LargoCm: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    Tipo: Schema.Attribute.Enumeration<['cadena', 'anillo', 'arete', 'dije']>
  }
}

export interface JoyeriaMetal extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_metales'
  info: {
    displayName: 'Metal y Material'
    icon: 'shield'
  }
  attributes: {
    Acabado: Schema.Attribute.Enumeration<
      ['pulido_brillante', 'rodinado', 'satinado_cepillado', 'diamantado', 'envejecido']
    >
    Color: Schema.Attribute.Enumeration<
      ['amarillo', 'blanco', 'rosa', 'dos_oros_amarillo_blanco', 'tricolor']
    > &
      Schema.Attribute.DefaultTo<'amarillo'>
    ColorHex: Schema.Attribute.String & Schema.Attribute.CustomField<'plugin::color-picker.color'>
    Material: Schema.Attribute.Enumeration<['oro', 'plata', 'platino', 'oro_laminado', 'acero']> &
      Schema.Attribute.Required
    Origen: Schema.Attribute.Enumeration<['italiano', 'nacional', 'importado']>
    PesoGramos: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    PurezaLey: Schema.Attribute.Enumeration<
      ['18k_750', '14k_585', '10k_417', '24k_999', 'ley_925', 'ley_950', 'no_aplica']
    > &
      Schema.Attribute.DefaultTo<'18k_750'>
  }
}

export interface JoyeriaOro extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_oros'
  info: {
    displayName: 'Oro'
  }
  attributes: {
    Color: Schema.Attribute.Enumeration<['amarillo', 'blanco', 'rosa']>
    Kilates: Schema.Attribute.Integer
    PesoGramos: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      >
    Tipo: Schema.Attribute.Enumeration<['italiano', 'nacional', 'importado']> &
      Schema.Attribute.Required
  }
}

export interface JoyeriaPortadaProducto extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_portada_productos'
  info: {
    description: 'Media principal y hover. Alt viene de MediaPrincipal.alternativeText en Media Library.'
    displayName: 'Portada de Producto'
    icon: 'landscape'
  }
  attributes: {
    MediaHover: Schema.Attribute.Media<'images' | 'videos'>
    MediaPrincipal: Schema.Attribute.Media<'images' | 'videos'> & Schema.Attribute.Required
  }
}

export interface JoyeriaVariante extends Struct.ComponentSchema {
  collectionName: 'components_joyeria_variantes'
  info: {
    displayName: 'Variante de Compra'
    icon: 'shopping-cart'
  }
  attributes: {
    Disponible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    NombreVariante: Schema.Attribute.String & Schema.Attribute.Required
    PrecioAdicional: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>
    SkuVariante: Schema.Attribute.String & Schema.Attribute.Required
    Stock: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>
    TallaOLargo: Schema.Attribute.String & Schema.Attribute.Required
  }
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'componentes.carrusel-de-banner': ComponentesCarruselDeBanner
      'componentes.enlace': ComponentesEnlace
      'componentes.marca': ComponentesMarca
      'componentes.metadatos': ComponentesMetadatos
      'joyeria.dimensiones': JoyeriaDimensiones
      'joyeria.foto-producto': JoyeriaFotoProducto
      'joyeria.gema': JoyeriaGema
      'joyeria.medidas': JoyeriaMedidas
      'joyeria.metal': JoyeriaMetal
      'joyeria.oro': JoyeriaOro
      'joyeria.portada-producto': JoyeriaPortadaProducto
      'joyeria.variante': JoyeriaVariante
    }
  }
}
