require "web3_api/gnosis_chain_explorer/client"
require "rails_helper"

RSpec.describe Web3Api::GnosisChainExplorer::Client do
  let(:client) { described_class.new }

  describe "#retrieve_tokens" do
    let(:wallet_address) { SecureRandom.hex }

    let(:request_path) { "#{described_class::BASE_URI}?action=tokentx&address=#{wallet_address}&apikey=key&module=account" }

    before do
      ENV["BLOCKSCOUT_API_KEY"] = "key"
      stub_request(:get, request_path)
    end

    let(:expected_headers) do
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    end

    it "makes a request to retrieve the wallet tokens" do
      client.retrieve_tokens(wallet_address: wallet_address)

      expect(
        a_request(:get, request_path)
          .with(headers: expected_headers)
      )
        .to have_been_made
        .once
    end
  end
end
