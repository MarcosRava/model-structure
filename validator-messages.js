//module.exports = {
//  Customer: {
//    generic: {
//      presence: "Preencha este campo.",
//      length: {
//        tooShort: "Este campo deve ter no mínimo %{count} caracteres.",
//        tooLong: "Este campo deve ter no máximo %{count} caracteres."
//      }
//    },
//
//    name: {
//      presence: "Digite o seu nome completo (sem abreviações).",
//      length: {
//        tooShort: "Não utilize abreviações em seu nome completo.",
//        tooLong: "Nome deve ter no máximo %{count} caracteres."
//      }
//    },
//
//    documentNumber: {
//      presence:  "Digite seu CPF ou CNPJ.",
//      length: {
//        tooShort: "O documento deve ter no mínimo %{count} dígitos.",
//        tooLong: "O documento deve ter no máximo %{count} dígitos."
//      },
//      inUse: "<div>Este documento já está sendo utilizado.</div><div><a href='/cadastro/continuar/'>Deseja recuperar seu cadastro?</a></div>"
//    },
//
//    birthDay: {
//      presence: "Esta não parece ser uma data válida."
//    },
//
//    userName: {
//      presence: "Digite o nome de usuário que deseja utilizar no site.",
//      length: {
//        tooShort: "O usuário deve conter no mínimo %{count} caracteres.",
//        tooLong: "O usuário deve conter no máximo %{count} caracteres."
//      },
//      format: "Não utilize caracteres especiais como pontuações, acentos ou espaços.",
//      inUse: "Este login já está sendo utilizado."
//    },
//
//    password: {
//      presence: "Digite a senha que deseja utilizar no site.",
//      format: "Utilize apenas números em sua senha.",
//      length: {
//        tooShort: "A senha deve conter no mínimo %{count} números.",
//        tooLong: "A senha deve conter no máximo %{count} números."
//      },
//      exclusion: "Senha muito fraca, defina outra mais complexa."
//    },
//
//    "_passwordConfirmation": {
//      format: "As senhas não coincidem, por favor digite novamente."
//    },
//
//    email: {
//      presence: "Digite o seu email principal.",
//      email: "Este não parece ser um email válido.",
//      inUse: "<div>Este email já está sendo utilizado.</div><div><a href='/cadastro/continuar/'>Deseja recuperar seu cadastro?</a></div>"
//    },
//
//    customerTypeId: {
//      presence: "Precisa do tipo do cliente."
//    },
//
//    stockExchangeCodeChecksum: {
//      presence: "Precisa do número da conta."
//    },
//    stockExchangeCode : {
//      presence: "Precisa do dígito da conta."
//    },
//
//    phoneNumber: {
//      presence: "Este não parece ser um telefone válido."
//    },
//
//    gender: {
//      presence: "Marque o seu sexo."
//    },
//
//    nationalityId: {
//      presence: "Preencha sua nacionalidade."
//    },
//
//    birthPlaceCountryId: {
//      presence: "Preencha o país em que nasceu."
//    },
//
//    birthPlaceStateId: {
//      presence: "Preencha o estado em que nasceu."
//    },
//
//    birthPlaceCityId: {
//      presence: "Preencha a cidade em que nasceu."
//    },
//
//    maritalStatusId: {
//      presence: "Preencha o seu estado civil."
//    },
//
//    spouseName: {
//      presence: "Preencha o nome completo do seu parceiro(a)."
//    },
//
//    documents: {
//      number: {
//        presence: "Preencha o número do documento."
//      },
//      issuingBodyId: {
//        presence: "Preencha o órgão que emitiu o documento."
//      },
//      issuingStateId: {
//        presence: "Preencha em qual estado foi emitido."
//      },
//      issuingDate: {
//        presence: "Preencha a data."
//      },
//      expirationDate: {
//        presence: "Preencha a data."
//      },
//      numericSecurityCode: {
//        presence: "Preencha este número."
//      }
//    },
//
//    motherName: {
//      presence: "Preencha o nome completo da sua mãe."
//    },
//
//    professionId: {
//      presence: "Escolha sua profissão."
//    },
//
//    addressZipCode: {
//      presence: "Escreva o CEP do seu endereço."
//    },
//
//    addressStreet: {
//      presence: "Escreva o nome da rua do seu endereço.",
//      length: {
//        tooLong: "O logradouro deve conter no máximo %{count} caracteres."
//      }
//    },
//
//    addressNumber: {
//      presence: "Defina"
//    },
//
//    addressStateId: {
//      presence: "Escreva o estado do seu endereço."
//    },
//
//    addressDistrict: {
//      presence: "Escreva o bairro do seu endereço."
//    },
//
//    addressCityId: {
//      presence: "Escreva a cidade do seu endereço."
//    },
//
//    originId: {
//      presence: "Escolha por onde nos conheceu."
//    },
//
//    responsibleTypeId: {
//      presence: "Escolha um tipo."
//    },
//
//    responsibleName: {
//      presence: "Defina o nome completo do responsável."
//    },
//
//    responsibleRg: {
//      presence: "Escreva o RG do responsável."
//    },
//
//    responsibleCpf: {
//      presence: "Escreva o CPF do responsável."
//    },
//
//    businessPurpose: {
//      presence: "Escreva o objeto social."
//    },
//
//    activityTypeId: {
//      presence: "Defina a atividade."
//    },
//
//    constitutionTypeId: {
//      presence: "Defina."
//    },
//
//    taxTypeId: {
//      presence: "Defina."
//    },
//
//    capital: {
//      presence: "Defina o capital social."
//    },
//
//    capitalDate: {
//      presence: "Defina a data base."
//    },
//
//    netWorth: {
//      presence: "Defina o patrimônio líquido."
//    },
//
//    netWorthDate: {
//      presence: "Defina a data base."
//    },
//
//    contractVersion: {
//      presence: "Aceite os termos."
//    },
//
//    otherIncome: {
//      presence: "Necessário declarar algum valor."
//    },
//
//    BankAccounts: {
//      length: {
//        minimum: "Adicione no mínimo uma conta bancária.",
//        maximum: "Cadastre no máximo 3 contas."
//      }
//    }
//  },
//  CompanyMember: {
//
//  }
//};
