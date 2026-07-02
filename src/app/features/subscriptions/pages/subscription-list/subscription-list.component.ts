import { Component, inject, signal, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Product } from '../../../administration/models/product.model';

@Component({
  selector: 'app-subscription-list',
  imports: [MoneyPipe, ConfirmDialogComponent],
  templateUrl: './subscription-list.component.html',
})
export class SubscriptionListComponent {
  private readonly subs = inject(UserSubscriptionService);

  readonly subscription   = this.subs.subscription;
  readonly currentPlan    = this.subs.currentPlan;
  readonly hasActive      = this.subs.hasActive;
  readonly resourceCount  = this.subs.currentPlanResourceCount;
  readonly paymentMethod  = this.subs.paymentMethod;
  readonly invoices       = this.subs.invoices;
  readonly availablePlans = this.subs.availablePlans;

  readonly isCancelling      = computed(() => this.subscription().status === 'cancels_at_period_end');
  readonly confirmCancelOpen = signal(false);

  isCurrent = (id: string) => this.subs.isCurrentPlan(id);

  periodLabel(plan: Product): string {
    return plan.billingPeriod === 'annual' ? '/año' : '/mes';
  }

  requestCancel(): void { this.confirmCancelOpen.set(true); }

  confirmCancel(): void {
    this.subs.cancel();
    this.confirmCancelOpen.set(false);
  }

  reactivate(): void { this.subs.reactivate(); }

  changePlan(plan: Product): void {
    if (!this.isCurrent(plan.id)) this.subs.changePlan(plan.id);
  }
}
