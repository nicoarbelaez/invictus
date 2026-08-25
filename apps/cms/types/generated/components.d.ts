import type { Schema, Struct } from '@strapi/strapi'

export interface ComponentesCarruselDeBanner extends Struct.ComponentSchema {
  collectionName: 'components_componentes_carrusel_de_banners'
  info: {
    displayName: 'Carrusel de Banner'
    icon: 'apps'
  }
  attributes: {
    alt: Schema.Attribute.Text & Schema.Attribute.Required
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required
    link: Schema.Attribute.String
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    position: Schema.Attribute.Integer & Schema.Attribute.Required
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
      'joyeria.medidas': JoyeriaMedidas
      'joyeria.oro': JoyeriaOro
    }
  }
}
