import { KUBERNETES } from '@/config/labels-annotations';

export const OPAQUE = 'Opaque';
export const SERVICE_ACCT = 'kubernetes.io/service-account-token';
export const DOCKER = 'kubernetes.io/dockercfg';
export const DOCKER_JSON = 'kubernetes.io/dockerconfigjson';
export const BASIC = 'kubernetes.io/basic-auth';
export const SSH = 'kubernetes.io/ssh-auth';
export const TLS = 'kubernetes.io/tls';
export const BOOTSTRAP = 'bootstrap.kubernetes.io/token';
export const ISTIO_TLS = 'istio.io/key-and-cert';

const DISPLAY_TYPES = {
  [OPAQUE]:       'Opaque',
  [SERVICE_ACCT]: 'Service Acct Token',
  [DOCKER]:       'Registry',
  [DOCKER_JSON]:  'Registry',
  [BASIC]:        'Basic Auth',
  [SSH]:          'SSH',
  [TLS]:          'Certificate',
  [BOOTSTRAP]:    'Bootstrap Token',
  [ISTIO_TLS]:    'Certificate (Istio)',
};

export default {
  keysDisplay() {
    const keys = [
      ...Object.keys(this.data || []),
      ...Object.keys(this.binaryData || [])
    ];

    if ( !keys.length ) {
      return '(none)';
    }

    // if ( keys.length >= 4 ) {
    //   return `${keys[0]}, ${keys[1]}, ${keys[2]} and ${keys.length - 3} more`;
    // }

    return keys.join(', ');
  },

  secretType() {
    return this._type;
  },

  typeDisplay() {
    const mapped = DISPLAY_TYPES[this._type];

    if ( mapped ) {
      return mapped;
    }

    return (this._type || '').replace(/^kubernetes.io\//, '');
  },

  tableTypeDisplay() {
    if (this._type === SERVICE_ACCT) {
      return { typeDisplay: this.typeDisplay, serviceAccountID: this.serviceAccountID };
    } else {
      return this.typeDisplay;
    }
  },

  serviceAccountID() {
    if (this.secretType === SERVICE_ACCT) {
      const name = this.metadata.annotations[KUBERNETES.SERVICE_ACCOUNT_NAME];
      const namespace = this.namespace;
      let fqid = name;

      if (namespace ) {
        fqid = `${ namespace }/${ name }`;
      }

      return fqid;
    }

    return null;
  }
};
