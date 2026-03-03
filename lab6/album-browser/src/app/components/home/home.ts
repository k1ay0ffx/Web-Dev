import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../../../services/product.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductListComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  visibleProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categories = this.productService.categories;

    // поддержка перехода из навбара по категории
    this.route.queryParams.subscribe(params => {
      if (params['cat']) {
        const cat = this.categories.find(c => c.id == params['cat']);
        if (cat) this.selectCategory(cat);
      }
    });
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
    this.visibleProducts = this.productService
      .getProductsByCategory(cat.id)
      .map(p => ({ ...p }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isSelected(cat: Category): boolean {
    return this.selectedCategory?.id === cat.id;
  }

  goHome() {
    this.selectedCategory = null;
    this.visibleProducts = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteProduct(productId: number) {
    this.visibleProducts = this.visibleProducts.filter(p => p.id !== productId);
  }
}