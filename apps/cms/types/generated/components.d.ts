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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'componentes.carrusel-de-banner': ComponentesCarruselDeBanner
      'componentes.enlace': ComponentesEnlace
      'componentes.marca': ComponentesMarca
      'componentes.metadatos': ComponentesMetadatos
      'joyeria.medidas': JoyeriaMedidas
      'joyeria.oro': JoyeriaOro
    }
  }
}
