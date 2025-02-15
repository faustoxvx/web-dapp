require "rails_helper"

RSpec.shared_examples "a discovery row get endpoint request" do
  context "when the discovery row passed exists" do
    let!(:discovery_row) { create :discovery_row }
    let(:slug) { discovery_row.slug }

    it "returns a successful response" do
      get_discovery_row

      expect(response).to have_http_status(:ok)
    end

    it "assigns the correct objects to be passed to the view" do
      get_discovery_row

      expect(assigns(:discovery_row)).to eq(DiscoveryRowBlueprint.render_as_json(discovery_row, view: :normal))
    end
  end

  context "when the discovery row passed does not exist" do
    let(:slug) { "random" }

    it "returns a not found response" do
      get_discovery_row

      expect(response).to have_http_status(:not_found)
    end
  end
end

RSpec.describe "Discovery rows", type: :request do
  describe "#show" do
    subject(:get_discovery_row) { get discovery_path(slug: slug, as: current_user) }

    context "when the current user is nil" do
      let(:current_user) { nil }

      it_behaves_like "a discovery row get endpoint request"
    end

    context "when the current user is passed" do
      let(:current_user) { create :user }

      it_behaves_like "a discovery row get endpoint request"
    end
  end

  describe "#index" do
    subject(:get_discovery_rows) { get(discovery_index_path(partnerships_only: partnerships_only), headers: {Accept: "application/json"}) }

    let!(:discovery_one) { create :discovery_row }
    let!(:partnership_one) { create :partnership, discovery_row: discovery_one }

    let!(:discovery_two) { create :discovery_row }

    let!(:discovery_three) { create :discovery_row }
    let!(:partnership_three) { create :partnership, discovery_row: discovery_three }

    let(:user) { create :user, profile_completed_at: Time.current }
    let!(:talent) { create :talent, user: user, public: true, hide_profile: false }

    let(:tag_one) { create :tag, discovery_row: discovery_one }
    let(:tag_two) { create :tag, discovery_row: discovery_two }

    before do
      create :user_tag, user: user, tag: tag_one
      create :user_tag, user: user, tag: tag_two
    end

    context "when partnerships_only is true" do
      let(:partnerships_only) { true }

      it "only returns rows with partnerships" do
        get_discovery_rows
        ids = json[:discovery_rows].map { |r| r[:id] }

        expect(ids).to match_array([discovery_one.id])
      end
    end

    context "when partnerships_only is false" do
      let(:partnerships_only) { false }

      it "only all rows" do
        get_discovery_rows

        ids = json[:discovery_rows].map { |r| r[:id] }

        expect(ids).to match_array([discovery_one.id, discovery_two.id])
      end
    end
  end
end
