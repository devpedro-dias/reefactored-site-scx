import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly isDark = computed(() => this.theme() === 'dark');

  /** O rótulo descreve o destino, não o estado atual. */
  readonly labelKey = computed(() =>
    this.isDark() ? 'a11y.themeToLight' : 'a11y.themeToDark',
  );

  toggle(): void {
    this.themeService.toggle();
  }
}
