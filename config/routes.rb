Mwaslat1::Application.routes.draw do
  devise_for :users
  match "notifications/mark_as_read/:id" => "notifications#mark_as_read"
  match "nodes/confirm_deletion" => "nodes#confirm_deletion"
  match "nodes/deletion_confirmed" => "nodes#deletion_confirmed"
  match "routes/data" => "routes#data"
  match "routes/:id/enhance" => "routes#enhance_route"
  match "routes/enhance_results" => "routes#enhance_results"
  match "routes/search" => "routes#search"
  match "routes/search/:id/edit" => "routes#update"
  match "nodes/new" => "nodes#new"
  match "nodes/delete" => "nodes#destroy"
  match "users/promote/:id" => "users#promote"
  resources :users
  resources :likes
  
  root :to => "routes#search"
  resources :routes
  resources :nodes
  resources :notifications
  match "/routes/nodes/districts" => "nodes#districts"
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => "welcome#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
