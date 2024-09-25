import {
    expect,
    describe,
    test,
    jest,
    beforeEach,
} from '@jest/globals'
import App from '../src/app.js'

describe('#App', () => {
    const elementObj = { innerHTML: '', value: '', onclick: jest.fn() }

    // Quando se tem uma mesma operação executada várias vezes nos testes, é possível utilizar certos hooks para automatizar (antes ou depois)
    // Mais informações: https://jestjs.io/docs/setup-teardown
    /** 
    Exemplos de hooks: 
    beforeEach (executa várias vezes, antes de cada teste)
    afterEach (executa várias vezes, depois de cada teste)
    beforeAll (executa apenas uma vez, no início dos testes)
    afterAll (executa apenas uma vez, ao final dos testes)
    */ 
    beforeEach(() => {
        /* 
        A função spyOn permite monitorar a execução de funções sem alterá-las diretamente. 
        Com ela, é possível observar como e quando uma função foi chamada, 
        com quais argumentos e quantas vezes, 
        além de possibilitar a simulação (mock) do retorno da função.
        */ 
        jest.spyOn(document, document.getElementById.name).mockReturnValue(elementObj)
    })

    describe('exemplos de testes com valores numéricos', () => {
        test('dado um valor, é possível comparar com outro valor', () => {
            // Dados mockados, mas poderiam vir de uma API
            let idadeFulano;
            const idadeRenan = 27;
            const idadePedro = 30;
            const idadeLucas = 25;

            // Checa se as variáveis foram instanciadas
            expect(idadeFulano).toBeUndefined();
            expect(idadeRenan).toBeDefined();
            expect(idadePedro).toBeDefined();
            expect(idadeLucas).toBeDefined();

            // Comparando idades (maior, menor ou igual)
            expect(idadeRenan).toBeGreaterThan(idadeLucas);
            expect(idadeRenan).toBeGreaterThanOrEqual(idadeLucas);
            expect(idadeRenan).toBeLessThan(idadePedro);     
            expect(idadeRenan).toBeLessThanOrEqual(idadePedro); 
            expect(idadeRenan).toEqual(idadeRenan);
        })
    })
    
    describe('#isNameValid deve checar se o nome é válido', () => {
        test('dado um nome vazio deve retornar falso', () => {
            const appInstance = new App({})
            const result = appInstance.isNameValid('')
            expect(result).toBeFalsy()
        })

        test('dado um nome deve retornar verdadeiro', () => {
            const appInstance = new App({})
            const result = appInstance.isNameValid('Renan')
            expect(result).toBeTruthy()
        })
    })

    describe('testando funções #updateTable e #clearNameInput', () => {
        test('#updateTable deve adicionar novas linhas no topo da tag body HTML', () => {
            const appInstance = new App({})
            
            appInstance.updateTable('Renan')
            appInstance.updateTable('Pedro')
            
            const expected = `
                <tr>
                <td>Pedro</td>
                </tr>
                <tr>
                <td>Renan</td>
                </tr>
            `.replace(/\s/g, '') // remove os espaços, só para facilitar ver melhor aqui o html aqui no teste
            
            // repare que o Pedro foi inserido por ultimo, na nossa logica, o ultimo sempre fica em primeiro
            // por isso ele está em primeiro
            expect(appInstance.tbody.innerHTML).toEqual(expected)
        })

        test('#cleanNameInput deve limpar o nome', () => {
            const appInstance = new App({})
            appInstance.name.value = "Renan"
            appInstance.cleanNameInput()
            expect(appInstance.name.value).toEqual("")
        })
    })

    describe('testando #onButtonClick', () => {
        test('#onButtonClick deve chamar as funções updateTable e cleanNameInput se o nome for válido', () => {
            const appInstance = new App({})
            jest.spyOn(appInstance, appInstance.updateTable.name).mockImplementation(() => { })
            jest.spyOn(appInstance, appInstance.cleanNameInput.name).mockImplementation(() => { })


            appInstance.name.value = 'Renan'
            appInstance.onButtonClick()

            expect(appInstance.updateTable).toHaveBeenCalled()
            expect(appInstance.cleanNameInput).toHaveBeenCalled()
        })

        test('#onButtonClick deve mostrar uma mensagem de alerta se o nome for inválido', () => {
            const appInstance = new App({})

            jest.spyOn(window, "alert").mockImplementation(() => { })
            jest.spyOn(appInstance, appInstance.updateTable.name).mockImplementation(() => { })
            jest.spyOn(appInstance, appInstance.cleanNameInput.name).mockImplementation(() => { })


            appInstance.name.value = ''
            appInstance.onButtonClick()

            expect(appInstance.updateTable).not.toHaveBeenCalled()
            expect(appInstance.cleanNameInput).not.toHaveBeenCalled()
            expect(window.alert).toHaveBeenCalledWith('o nome é obrigatorio!')

        })

    })

    describe('testando #configureButton', () => {
        test('#configureButton deve utilizar a função onButtonClick quando for clicado - função onclick for chamada', () => {
            const appInstance = new App({})
            jest.spyOn(appInstance, appInstance.onButtonClick.name).mockReturnValue()
            
            appInstance.btnSubmit.onclick()
            expect(appInstance.onButtonClick).not.toHaveBeenCalled()
            
            appInstance.configureButton()
            appInstance.btnSubmit.onclick()
            
            expect(appInstance.onButtonClick).toHaveBeenCalled()
        })
    })
        
    describe('testando #updateTableWithCharactersFromAPI', () => {
        test('#updateTableWithCharactersFromAPI deve mostrar apenas os nomes obtidos da resposta da API', async () => {
            const apiUrl = 'https://hello-test-api.com'
            const appInstance = new App({ apiUrl })
            jest.spyOn(appInstance, appInstance.updateTable.name).mockReturnValue()
            
            const mockAPIResponse = {
                "info": {
                    "count": 671,
                    "pages": 34,
                    "next": "https://rickandmortyapi.com/api/character?page=2",
                    "prev": null
                },
                "results": [{
                    "id": 1,
                    "name": "Rick Sanchez",
                    "status": "Alive",
                    "species": "Human",
                    "type": "",
                    "gender": "Male",
                    "origin": {
                        "name": "Earth (C-137)",
                        "url": "https://rickandmortyapi.com/api/location/1"
                    },
                    "location": {
                        "name": "Earth (Replacement Dimension)",
                        "url": "https://rickandmortyapi.com/api/location/20"
                    },
                    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
                    "episode": ["https://rickandmortyapi.com/api/episode/1"],
                    "url": "https://rickandmortyapi.com/api/character/1",
                    "created": "2017-11-04T18:48:46.250Z"
                }]
            }
            
            global.fetch = jest.fn()
            .mockResolvedValue({ json: async () => mockAPIResponse });
            
            await appInstance.updateTableWithCharactersFromAPI()
            
            expect(global.fetch).toHaveBeenCalledWith(apiUrl)
            expect(appInstance.updateTable).toHaveBeenCalledWith("Rick Sanchez")
        })
    })
        
    describe('testando #initialize', () => {
        test('#initialize deve chamar configureButton e updateTableWithCharactersFromAPI', async () => {
            const appInstance = new App({})
            jest.spyOn(appInstance, appInstance.updateTableWithCharactersFromAPI.name).mockResolvedValue()
            jest.spyOn(appInstance, appInstance.configureButton.name).mockResolvedValue()
            
            await appInstance.initialize()
            
            expect(appInstance.configureButton).toHaveBeenCalled()
            expect(appInstance.updateTableWithCharactersFromAPI).toHaveBeenCalled()
            
        })
    })
})