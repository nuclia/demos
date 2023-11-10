from nuclia import sdk

auth = sdk.NucliaAuth()
auth.kb(
    url="https://europe-1.nuclia.cloud/api/v1/kb/<KB_ID>",
    token="<API_KEY>",
    interactive=False
)
nua = auth.nua(
    "europe-1",
    "<NUA_KEY>",
)
nuas = sdk.NucliaNUAS()
nuas.default(nua)

nuclia_agent = sdk.NucliaAgent()

agent = nuclia_agent.generate_agent("Toronto")
print(agent.ask("Tell me about the parks"))